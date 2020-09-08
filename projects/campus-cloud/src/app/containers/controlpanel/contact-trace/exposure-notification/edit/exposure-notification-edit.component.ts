import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, finalize, map, takeUntil, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { ExposureNotification } from '@controlpanel/contact-trace/exposure-notification/models';
import { ExposureNotificationService } from '@controlpanel/contact-trace/exposure-notification/services';
import { baseActionClass, baseActions, IHeader } from '@campus-cloud/store';
import { Store } from '@ngrx/store';
import { AnnouncementPriority } from '@controlpanel/notify/announcements/model';
import { CPI18nService } from '@campus-cloud/shared/services';
import { CPSession } from '@campus-cloud/session';
import * as fromStore from '@controlpanel/contact-trace/cases/store';
import { getCases, getSelectedCaseStatus } from '@controlpanel/contact-trace/cases/store';
import { ICase, ICaseLog, ICaseStatus } from '@controlpanel/contact-trace/cases/cases.interface';
import { HttpParams } from '@angular/common/http';
import { CasesService } from '@controlpanel/contact-trace/cases/cases.service';
import { AnnouncementUtilsService } from '@controlpanel/notify/announcements/announcement.utils.service';
import { FORMAT } from '@campus-cloud/shared/pipes';
import { ModalService } from '@ready-education/ready-ui/overlays';
import { OverlayRef } from '@angular/cdk/overlay';
import { AudienceService } from '@controlpanel/audience/audience.service';
import { CasesUtilsService } from '@controlpanel/contact-trace/cases/cases.utils.service';
import { ImportUserListComponent } from '@controlpanel/contact-trace/exposure-notification/components';

interface IImportedUser {
  name: string;
  email: string;
}

@Component({
  selector: 'cp-exposure-notification-edit',
  templateUrl: './exposure-notification-edit.component.html',
  styleUrls: ['./exposure-notification-edit.component.scss']
})
export class ExposureNotificationEditComponent implements OnInit, OnDestroy {
  dateTimeFormat = FORMAT.DATETIME;
  protected unsubscribe: Subject<void> = new Subject();
  notification: ExposureNotification = {
    user_ids: []
  };
  webServiceCallInProgress: boolean;
  types = [
    {
      action: AnnouncementPriority.regular,
      disabled: false,
      label: this.cpI18n.translate('regular'),
      description: this.cpI18n.translate('announcements_regular_help')
    },
    {
      action: AnnouncementPriority.urgent,
      disabled: false,
      label: this.cpI18n.translate('urgent'),
      description: this.cpI18n.translate('announcements_urgent_help')
    }
  ];
  toOptions = [
    {
      action: 'custom_list',
      disabled: false,
      label: this.cpI18n.translate('contact_trace_notification_custom_list')
    },
    {
      action: 'case_status',
      disabled: false,
      label: this.cpI18n.translate('contact_trace_notification_case_status')
    }
  ];

  toCaseOption = [this.toOptions[0]];
  templates;
  filterOptions;
  selectedType;
  selectedToOption;
  selectedTemplate;
  selectedFilterOption;
  subject_prefix = {
    label: null,
    type: null
  };
  highlightFormError: boolean;
  templateTypeToTemplateMap;
  CaseActionToTemplateTypeMap;
  caseId: number;
  serviceName = '';
  notifyDestination = '';

  importFromCSVModal: OverlayRef;

  private getCasesById$: Observable<ICaseStatus>;
  casesById: ICase;
  cases$: Observable<ICase[]>;
  caseStatus$: Observable<ICaseStatus>;
  selectedCaseStatus: ICaseStatus;
  casesForUsers: Map<number, ICase> = new Map<number, ICase>();

  /*User list observable*/
  userList$: Observable<number[]> = new Observable<number[]>();
  userImportedFromCSV$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  userInsertedFromInput$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  importedUsers$: BehaviorSubject<IImportedUser[]> = new BehaviorSubject<IImportedUser[]>([]);

  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationService: ExposureNotificationService,
    private store: Store<IHeader>,
    private storeCase: Store<fromStore.State>,
    private router: Router,
    private cpI18n: CPI18nService,
    private session: CPSession,
    private casesService: CasesService,
    private modalService: ModalService,
    private audienceService: AudienceService,
    private util: CasesUtilsService
  ) {
    this.CaseActionToTemplateTypeMap = {
      'ct:exposed_notify': 2,
      'ct:symptomatic_notify': 3,
      'ct:self_reported_notify': 4,
      'ct:trace_contacts': 2,
      'ct:exposure_notify': 2
    };

    this.cases$ = this.storeCase.select(getCases);

    this.caseStatus$ = this.storeCase.select(getSelectedCaseStatus);
    this.caseStatus$.subscribe((value) => {
      this.selectedCaseStatus = value;
    });
    this.userList$ = combineLatest([this.userImportedFromCSV$, this.userInsertedFromInput$]).pipe(
      map(([userImportedFromCSV, userInsertedFromInput]) => {
        let userList: number[] = [];
        userList = userList.concat(userImportedFromCSV);
        userList = userList.concat(userInsertedFromInput);

        return [...new Set(userList)];
      })
    );

    this.importedUsers$.subscribe((users) => {
      users.forEach((user) =>
        this.addUserFromAudience(user.email)
          .pipe(
            filter((audiences) => audiences && audiences.length > 0),
            tap((audiences) =>
              this.userImportedFromCSV$.next([
                ...this.userImportedFromCSV$.getValue(),
                audiences[0].id
              ])
            )
          )
          .subscribe()
      );
    });

    this.userList$.subscribe((userList) => {
      if (this.caseId) {
        this.notification.user_ids = userList;
      }
    });
  }

  ngOnDestroy() {
    // Do this to un-subscribe all subscriptions on this page
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe)).subscribe((params) => {
      const notificationId: number = Number(params['notificationId']);
      this.getItemForEdit(notificationId).subscribe((notification) => {
        this.notification = { ...notification, user_ids: this.notification.user_ids };
        this.buildHeader();
      });
    });

    this.getNotificationTemplates();
    this.getCaseStatuses();
    this.initNotificationForm();

    this.getCasesById$ = this.storeCase.select(fromStore.getSelectedCaseStatus);
    this.getCasesById$
      .pipe(filter((caseStatus) => caseStatus !== null && caseStatus.user_list_id !== null))
      .subscribe(({ user_list_id }) => {
        this.notification.list_ids = [user_list_id];
      });
    this.onToOptionChanged(this.toOptions[0]);
  }

  private getItemForEdit(notificationId: number): Observable<ExposureNotification> {
    if (!notificationId) {
      return this.notificationService.getStore(this.session.schoolCTServiceId).pipe(
        tap(({ name }) => (this.serviceName = name)),
        map(({ storeId }) => {
          const newObj: ExposureNotification = {
            type: 1,
            store_id: storeId
          };
          return newObj;
        })
      );
    }
    return this.notificationService.getNotification(notificationId);
  }

  private buildHeader() {
    const payload = {
      heading: 'contact_trace_notification_notify',
      em: null,
      crumbs: {
        url: 'exposure-notification',
        label: 'contact_trace_exposure_notification'
      },
      children: []
    };

    Promise.resolve().then(() => {
      this.store.dispatch({
        type: baseActions.HEADER_UPDATE,
        payload
      });
    });
  }

  cancelClickHandler(): void {
    if (this.caseId) {
      window.history.back();
    }

    this.router.navigate(['/contact-trace/exposure-notification']);
  }

  onSchedule(scheduledAt: number) {
    this.notification.notify_at_epoch = scheduledAt;
  }

  get isScheduledAnnouncement() {
    return this.notification.notify_at_epoch !== undefined &&
      this.notification.notify_at_epoch !== -1
      ? AnnouncementUtilsService.isScheduledAnnouncement({
          notify_at_epoch: this.notification.notify_at_epoch
        })
      : false;
  }

  onTypeChanged(type): void {
    this.setPriority(type.action);
  }

  onToOptionChanged(option): void {
    this.selectedToOption = option;
  }

  onTemplateOptionChanged(option): void {
    this.selectedTemplate = option;
    const selectedTemplate = this.templateTypeToTemplateMap[option.action];
    if (selectedTemplate) {
      this.setPriority(selectedTemplate.priority);
      this.notification.subject = selectedTemplate.subject;
      this.notification.message = selectedTemplate.message;
    } else {
      this.setPriority(AnnouncementPriority.regular);
      this.notification.subject = '';
      this.notification.message = '';
    }
  }

  private setPriority(priority): void {
    this.subject_prefix = {
      label: null,
      type: null
    };

    if (priority === AnnouncementPriority.emergency) {
      this.subject_prefix = {
        label: this.cpI18n.translate('emergency'),
        type: 'danger'
      };
    }

    if (priority === AnnouncementPriority.urgent) {
      this.subject_prefix = {
        label: this.cpI18n.translate('urgent'),
        type: 'warning'
      };
    }

    this.notification.priority = priority;
    this.selectedType = this.getObjectFromTypesArray(priority);
  }

  onFilterOptionChanged(option): void {
    this.store.dispatch(
      new fromStore.GetCaseStatusById({
        id: option.action,
        exclude_external_cases: true
      })
    );
    this.selectedFilterOption = option;
  }

  private getObjectFromTypesArray(id) {
    let result;

    this.types.forEach((type) => {
      if (type.action === id) {
        result = type;
      }
    });

    return result;
  }

  usersChanged(userIds): void {
    this.userInsertedFromInput$.next(userIds);
  }

  sendClickHandler(): void {
    this.highlightFormError = false;
    const errorMessages: string[] = this.validateBeforeSave(this.notification);
    if (errorMessages && errorMessages.length > 0) {
      this.showWarning();
      this.highlightFormError = true;
    } else {
      if (this.notification.user_ids && this.notification.user_ids.length === 0) {
        delete this.notification.user_ids;
      }
      this.webServiceCallInProgress = true;
      this.notificationService
        .createNotification(this.notification)
        .pipe(finalize(() => (this.webServiceCallInProgress = false)))
        .subscribe((notification) => {
          if (this.caseId) {
            const param = new HttpParams().set('school_id', this.session.schoolIdAsString);
            this.casesService
              .updateCase(
                {
                  ...this.casesById,
                  perform_current_action: true
                },
                this.caseId,
                param
              )
              .subscribe((value) => this.handleSaveSuccess(notification));
          } else {
            return this.handleSaveSuccess(notification);
          }
        });
    }
  }

  isNullOrEmptyString(str: string): boolean {
    return !str || str.trim().length === 0;
  }

  private handleSaveSuccess(notification: ExposureNotification): void {
    this.handleSuccess('contact_trace_notification_successfully_saved');
    if (this.caseId) {
      window.history.back();
    }
    this.router.navigate(['/contact-trace/exposure-notification']);
  }

  private validateBeforeSave(notification: ExposureNotification): string[] {
    const errorMessages: string[] = [];

    if (notification) {
      if (
        this.selectedToOption &&
        this.selectedToOption.action === 'custom_list' &&
        (!notification.user_ids || notification.user_ids.length === 0)
      ) {
        errorMessages.push('User Ids');
      }

      if (
        this.selectedToOption &&
        this.selectedToOption.action === 'case_status' &&
        (!notification.list_ids || notification.list_ids.length === 0)
      ) {
        errorMessages.push('Case Filter');
      }

      if (!notification.subject || notification.subject.trim().length === 0) {
        errorMessages.push('Subject');
      }
      if (!notification.message || notification.message.trim().length === 0) {
        errorMessages.push('Message');
      }

      if (this.notification.notify_at_epoch > 0 && !this.isScheduledAnnouncement) {
        errorMessages.push('Scheduled');
      }
    }

    return errorMessages;
  }

  private handleSuccess(key) {
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: this.cpI18n.translate(key)
      })
    );
  }

  private showWarning() {
    const options = {
      class: 'warning',
      body: this.cpI18n.translate('error_fill_out_marked_fields')
    };

    this.dispatchSnackBar(options);
  }

  private dispatchSnackBar(options) {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        ...options,
        sticky: true,
        autoClose: true
      }
    });
  }

  private getNotificationTemplates(): void {
    this.notificationService.searchNotificationTemplates().subscribe((templates) => {
      this.templateTypeToTemplateMap = {};
      this.templates = [
        {
          action: null,
          label: this.cpI18n.translate('contact_trace_notification_none')
        }
      ];
      if (templates) {
        templates.forEach((template) => {
          this.templateTypeToTemplateMap[template.type] = template;
          this.templates.push({
            action: template.type,
            label: template.name
          });
        });
      }
    });
  }

  private getCaseStatuses(): void {
    this.storeCase.dispatch(new fromStore.GetCaseStatus());
    this.notificationService.searchCaseStatuses().subscribe((statuses: ICaseStatus[]) => {
      this.filterOptions = [
        {
          action: 0,
          disabled: true,
          displayCheckIcon: false,
          label: this.cpI18n.translate('contact_trace_notification_select_status')
        }
      ];
      this.selectedFilterOption = this.filterOptions[0];
      if (statuses) {
        statuses.sort((a, b) => b.rank - a.rank);
        statuses.forEach((status) => {
          this.filterOptions.push({
            action: status.id,
            label: status.name,
            caseCount: status.case_count
          });
        });
      }
    });
  }

  initNotificationForm(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.caseId = Number(params['case_id']);
      if (this.caseId) {
        this.webServiceCallInProgress = true;
        const param = new HttpParams().set('school_id', this.session.schoolIdAsString);
        this.casesService.getCaseById(param, this.caseId).subscribe((value: ICase) => {
          this.casesById = value;
          this.notifyDestination = this.casesById.firstname + ' ' + this.casesById.lastname + '<' + this.casesById.extern_user_id + '>';
          this.notification.user_ids = [this.casesById.user_id];
          this.onToOptionChanged({
            action: 'custom_list',
            disabled: false,
            label: this.cpI18n.translate('contact_trace_notification_custom_list')
          });
          setTimeout(() => {
            const templateType = this.CaseActionToTemplateTypeMap[
              this.casesById.current_action.code
            ];
            this.onTemplateOptionChanged({
              action: templateType,
              label: this.templateTypeToTemplateMap[templateType].name
            });
            this.webServiceCallInProgress = false;
          }, 500);

          this.ifExposureNotification(this.casesById);

        });
      }
    });
  }

  private ifExposureNotification(casesById: ICase) {
    if (casesById.current_action.code !== 'ct:exposure_notify') {
      return;
    }
    const params = new HttpParams()
      .append('school_id', this.session.school.id.toString())
      .append('case_id', casesById.id.toString())
      .append('all', '1');
    this.casesService.getCaseActivityLog(1, 1000, params)
      .subscribe((logs: ICaseLog[]) => {
        const activityLog = logs.find((log) => log.contact_trace_event_id !== 0);
        if (activityLog) {
          const casesParams = new HttpParams()
            .append('school_id', this.session.school.id.toString())
            .append('contact_trace_event_id', activityLog.contact_trace_event_id.toString())
            .append('all', '1');
          this.casesService.getCases(1, 10000, casesParams)
            .subscribe((cases: ICase[]) => {
              if (cases.length) {
                this.notification.user_ids = cases.map((caseItem) => caseItem.user_id);
                this.notifyDestination = '';
                cases.forEach((caseItem) => {
                  this.notifyDestination += caseItem.firstname + ' ' + caseItem.lastname + '<' + caseItem.extern_user_id + '>, ';
                });
              }
            });
        }
      });
  }

  importModal() {
    this.importFromCSVModal = this.modalService.open(ImportUserListComponent, {
      data: {},
      onAction: this.onImport.bind(this),
      onClose: this.resetImportModal.bind(this)
    });
  }

  onImport(usersList: IImportedUser[]) {
    if (usersList) {
      this.importedUsers$.next(usersList);
    }
    this.resetImportModal();
  }

  resetImportModal() {
    this.importFromCSVModal.dispose();
  }

  private addUserFromAudience(email: string): Observable<any> {
    const param = new HttpParams()
      .set('school_id', this.session.schoolIdAsString)
      .append('email', email);
    return this.audienceService.getUsers(param);
  }

  onDownloadCasesFromCaseStatus() {
    const params = new HttpParams()
      .append('school_id', this.session.g.get('school').id)
      .append('exclude_external', 'true')
      .append('current_status_ids', this.selectedCaseStatus.id.toString())
      .append('all', '1');

    this.casesService.getCases(null, null, params).subscribe((cases: ICase[]) => {
      if (cases.length) {
        this.util.exportUserCases(cases);
      }
    });
  }

  onDownloadCasesFromUsers() {
    const userIds: number[] = Array.from(this.casesForUsers.keys());
    userIds
      .filter((id) => !this.notification.user_ids.find((userId) => userId === id))
      .forEach((id) => this.casesForUsers.delete(id));

    this.updateCasesForUsersAndDownload(this.notification.user_ids);
  }

  private updateCasesForUsersAndDownload(user_ids: number[]) {
    const filteredUserIds = user_ids.filter((userId) => !this.casesForUsers.get(userId));
    const params = new HttpParams()
      .append('user_ids', filteredUserIds.toString())
      .append('school_id', this.session.g.get('school').id);
    const stream$ = this.casesService
      .getCaseById(params)
      .pipe(
        tap((cases: ICase[]) =>
          cases
            .filter((caseItem) => caseItem)
            .forEach((caseItem) => this.casesForUsers.set(caseItem.user_id, caseItem))
        )
      );

    stream$.subscribe(() => {
      const exposureData = Array.from(this.casesForUsers.values());
      if (!!exposureData.length) {
        this.util.exportUserCases(exposureData);
      } else {
        this.store.dispatch(
          new baseActionClass.SnackbarError({
            body: this.cpI18n.translate('contact_trace_exposure_notification_empty_cases')
          })
        );
      }
    });
  }
}
