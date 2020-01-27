import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { OverlayRef } from '@angular/cdk/overlay';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import { CPSession } from '@campus-cloud/session';
import { FORMAT } from '@campus-cloud/shared/pipes';
import { AnnouncementRecipientPipe } from './../pipes';
import { Announcement, IAnnouncement } from './../model';
import { LayoutWidth } from '@campus-cloud/layouts/interfaces';
import { AnnouncementsService } from './../announcements.service';
import { AnnouncementUtilsService } from './../announcement.utils.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { AnnouncementAmplitudeService } from '../announcement.amplitude.service';
import {
  notifyAtEpochNow,
  AnnouncementPriority,
  AnnouncementStatus
} from './../model/announcement.interface';
import { AnnouncementCreateErrorComponent } from './../create-error/create-error.component';
import { ISnackbar, baseActionClass, IHeader, baseActions } from '@campus-cloud/store/base';
import { AnnouncementsConfirmComponent } from './../confirm/announcements-confirm.component';
import { CPI18nService, ModalService, CPTrackingService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-scheduled-edit',
  templateUrl: './scheduled-edit.component.html',
  styleUrls: ['./scheduled-edit.component.scss']
})
export class ScheduledEditComponent implements OnInit {
  form: FormGroup;
  listName: string;
  modal: OverlayRef;
  showErrors = false;
  width = LayoutWidth.third;
  dateTimeFormat = FORMAT.DATETIME;

  state = {
    loading: false
  };

  constructor(
    private router: Router,
    private session: CPSession,
    private route: ActivatedRoute,
    private cpI18n: CPI18nService,
    private modalService: ModalService,
    private service: AnnouncementsService,
    private cpTracking: CPTrackingService,
    private store: Store<ISnackbar | IHeader>,
    private recipientNamePipe: AnnouncementRecipientPipe
  ) {}

  ngOnInit() {
    this.fetch();
    this.buildHeader();
  }

  onSchedule(scheduledAt: number) {
    this.form.get('notify_at_epoch').setValue(scheduledAt);
  }

  onCancel() {
    this.router.navigate(['/notify/scheduled']);
  }

  onSendNow() {
    this.form.get('notify_at_epoch').setValue(notifyAtEpochNow);
    this.onSubmit(true);
  }

  onValidationTearDown() {
    this.modalService.close(this.modal);
    this.modal = null;
  }

  onTeardownConfirm() {
    this.modalService.close(this.modal);
    this.modal = null;
  }

  onConfirmed() {
    this.modalService.close(this.modal);
    this.modal = null;
    this.onSubmit(true);
  }

  onSubmit(hasConfirmed = false) {
    this.showErrors = false;

    if (this.form.invalid) {
      this.showErrors = true;
      return;
    }

    const isScheduled = AnnouncementUtilsService.isScheduledAnnouncement(this.form.value);
    const isNotifyAtTimestampInThePast =
      isScheduled &&
      AnnouncementUtilsService.isNotifyAtTimestampInThePast(this.form.get('notify_at_epoch').value);
    const iswithinFiveMinutes =
      isScheduled &&
      AnnouncementUtilsService.withinFiveMinutes(this.form.get('notify_at_epoch').value);

    if (isNotifyAtTimestampInThePast && !iswithinFiveMinutes) {
      this.modal = this.modalService.open(
        AnnouncementCreateErrorComponent,
        {},
        {
          onAction: this.onSendNow.bind(this),
          onClose: this.onValidationTearDown.bind(this)
        }
      );
      return;
    }

    const priority = this.form.get('priority').value;
    const isCampusWide = this.form.get('is_school_wide').value;
    const shouldConfirm =
      priority === AnnouncementPriority.emergency ||
      priority === AnnouncementPriority.urgent ||
      isCampusWide;
    if (shouldConfirm && !hasConfirmed) {
      this.modal = this.modalService.open(
        AnnouncementsConfirmComponent,
        {},
        {
          data: this.state,
          onAction: this.onConfirmed.bind(this),
          onClose: this.onTeardownConfirm.bind(this)
        }
      );
      return;
    }

    const { id } = this.session.school;
    const { announcementId } = this.route.snapshot.params;
    const search = new HttpParams().set('school_id', id.toString());

    const { store_id, subject, message, notify_at_epoch } = this.form.value;

    const notifyAtEpoch = iswithinFiveMinutes ? notifyAtEpochNow : notify_at_epoch;

    const editableFields = {
      subject,
      message,
      store_id,
      priority,
      notify_at_epoch: notifyAtEpoch
    };

    this.service.updateAnnouncement(search, announcementId, editableFields).subscribe(
      (r: IAnnouncement) => {
        const { sub_menu_name } = this.cpTracking.getAmplitudeMenuProperties() as any;
        this.cpTracking.amplitudeEmitEvent(amplitudeEvents.NOTIFY_UPDATED_COMMUNICATION, {
          sub_menu_name,
          ...AnnouncementAmplitudeService.getAmplitudeProperties(r, announcementId)
        });

        this.store.dispatch(
          new baseActionClass.SnackbarSuccess({
            body: this.cpI18n.translate('t_announcement_edit_success')
          })
        );

        const redirectUrl =
          notifyAtEpoch !== notifyAtEpochNow ? '/notify/scheduled' : '/notify/sent';

        this.router.navigate([redirectUrl]);
      },
      (error: HttpErrorResponse) => this.errorUpdateHandler(error.status)
    );
  }

  buildHeader() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: 't_notify_edit_announcement',
        subheading: null,
        em: null,
        crumbs: {
          url: null,
          label: null
        },
        children: []
      }
    });
  }

  fetch() {
    this.state = {
      ...this.state,
      loading: true
    };
    const { id } = this.session.school;
    const { announcementId } = this.route.snapshot.params;
    const search = new HttpParams().set('school_id', id.toString());

    this.service.getAnnouncementById(search, announcementId).subscribe(
      (r: IAnnouncement) => this.handleSucess(r),
      () => {
        this.store.dispatch(
          new baseActionClass.SnackbarError({ body: this.cpI18n.translate('something_went_wrong') })
        );
        this.router.navigate(['/notify/scheduled']);
      }
    );
  }

  handleSucess(data: IAnnouncement) {
    if (data.status === AnnouncementStatus.sent) {
      this.store.dispatch(
        new baseActionClass.SnackbarError({
          body: this.cpI18n.translate('t_notify_announcement_already_sent')
        })
      );

      this.router.navigate(['/notify/scheduled']);
      return;
    }

    if (data.list_details.length) {
      data = {
        ...data,
        list_details: data.list_details.map((l) => l.id) as any
      };
    }

    if (data.user_details.length) {
      data = {
        ...data,
        user_details: data.user_details.map((u) => u.id) as any
      };
    }

    this.form = Announcement.form(data);
    this.listName = this.recipientNamePipe.transform(data);

    this.state = {
      ...this.state,
      loading: false
    };
  }

  errorUpdateHandler(errorCode: number = 400) {
    this.state = {
      ...this.state,
      loading: false
    };

    const errorKey =
      errorCode === 409 ? 't_notify_announcement_already_sent' : 'something_went_wrong';
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate(errorKey)
      })
    );
  }
}
