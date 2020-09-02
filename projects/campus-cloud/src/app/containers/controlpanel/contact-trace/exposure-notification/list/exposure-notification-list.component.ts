import { Component, OnInit } from '@angular/core';
import { merge, Observable, of, Subject } from 'rxjs';
import { CPSession } from '@campus-cloud/session';
import { ContactTraceHeaderService } from '@controlpanel/contact-trace/utils';
import { Router } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  share,
  startWith,
  switchMap
} from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { ExposureNotification, ExposureNotificationStatus } from '../models';
import { ExposureNotificationService } from '../services';
import { CPI18nPipe, FORMAT } from '@campus-cloud/shared/pipes';
import { baseActionClass, ISnackbar } from '@campus-cloud/store';
import { Store } from '@ngrx/store';
import { ModalService } from '@ready-education/ready-ui/overlays';
import { OverlayRef } from '@angular/cdk/overlay';
import { ExposureNotificationDeleteComponent } from '@controlpanel/contact-trace/exposure-notification/components/delete';
import { CasesService } from '@controlpanel/contact-trace/cases/cases.service';
import { ICase } from '@controlpanel/contact-trace/cases/cases.interface';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { canSchoolWriteResource } from '@campus-cloud/shared/utils';

@Component({
  selector: 'cp-exposure-notification-list',
  templateUrl: './exposure-notification-list.component.html',
  styleUrls: ['./exposure-notification-list.component.scss']
})
export class ExposureNotificationListComponent implements OnInit {
  CONTACT_TRACE_TYPE = '1';

  webServiceCallInProgress: boolean;

  searchTerm: string;
  searchTermStream = new Subject<string>();
  pageStream = new Subject<number>();
  filterStream = new Subject<ExposureNotificationStatus>();
  hasMorePages = false;

  filter: ExposureNotificationStatus;
  pageCounter = 1;
  paginationCountPerPage = 25;
  results: ExposureNotification[] = [];
  dateFormat = FORMAT.DATETIME;
  showViewMessageModal: boolean;
  notificationForView: ExposureNotification;
  notificationStatus = ExposureNotificationStatus;
  deleteModal: OverlayRef;

  constructor(
    private modalService: ModalService,
    private session: CPSession,
    private headerService: ContactTraceHeaderService,
    private notificationService: ExposureNotificationService,
    private router: Router,
    private cpI18n: CPI18nPipe,
    private store: Store<ISnackbar>,
    public casesService: CasesService
  ) {}

  ngOnInit(): void {
    this.headerService.updateHeader();

    const searchSource = this.searchTermStream.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((searchTerm) => {
        this.searchTerm = searchTerm;
        this.pageCounter = 1;
        return { searchTerm: searchTerm, page: this.pageCounter };
      })
    );

    const pageSource = this.pageStream.pipe(
      map((pageNumber) => {
        this.pageCounter = pageNumber;
        return { searchTerm: this.searchTerm, page: pageNumber };
      })
    );

    const filterSource = this.filterStream.pipe(
      map((filter) => {
        this.filter = filter;
        this.pageCounter = 1;
        return { searchTerm: this.searchTerm, page: this.pageCounter };
      })
    );

    const combinedSource: Observable<any[]> = merge(pageSource, searchSource, filterSource).pipe(
      startWith({ searchTerm: this.searchTerm, page: this.pageCounter }),
      switchMap((args: { searchTerm: string; page: number }) => {
        return this.fetch(args.page, this.paginationCountPerPage);
      }),
      share()
    );

    combinedSource.subscribe((data) => this.handleDataLoad(data));
  }

  fetch(pageNumber: number, paginationCountPerPage: number): Observable<ExposureNotification[]> {
    const startRecordCount = paginationCountPerPage * (pageNumber - 1) + 1;
    // Get an extra record so that we know if there are more records left to fetch
    const endRecordCount = paginationCountPerPage * pageNumber + 1;
    const params = new HttpParams()
      .set('type', this.CONTACT_TRACE_TYPE)
      .set('search_str', this.searchTerm === '' ? null : this.searchTerm)
      .set('school_id', this.session.school.id.toString())
      .set('statuses', this.filter === null || this.filter === undefined ? null : '' + this.filter);
    this.webServiceCallInProgress = true;
    return this.notificationService
      .searchNotifications(startRecordCount, endRecordCount, params)
      .pipe(
        map((notifications: ExposureNotification[]) => {
          if (notifications && notifications.length > this.paginationCountPerPage) {
            this.hasMorePages = true;
            // Remove the extra record that we fetched to check if we have more records to fetch.
            notifications = notifications.splice(0, this.paginationCountPerPage);
          } else {
            this.hasMorePages = false;
          }
          return notifications;
        }),
        finalize(() => (this.webServiceCallInProgress = false)),
        catchError(() => {
          this.hasMorePages = false;
          return of([]);
        })
      );
  }

  private handleDataLoad(data: ExposureNotification[]) {
    this.results = data;
  }

  onPaginationNext() {
    this.pageCounter++;
    this.pageStream.next(this.pageCounter);
  }

  onPaginationPrevious() {
    this.pageCounter--;
    this.pageStream.next(this.pageCounter);
  }

  onLaunchCreateModal(): void {
    this.router.navigate(['/contact-trace/exposure-notification/edit', 0]);
  }

  onSearch(search_str) {
    this.searchTermStream.next(search_str);
  }

  itemUpdateHandler(): void {
    // Refresh items on current page
    this.pageStream.next(this.pageCounter);
  }

  filterChangeHandler({ action }: { label?: string; action?: ExposureNotificationStatus }): void {
    this.filterStream.next(action);
  }

  onDeletedNotification(): void {
    this.handleSuccess('contact_trace_notification_delete_success');
    // Refresh items on current page
    this.pageStream.next(this.pageCounter);
    this.resetModal();
  }

  private handleSuccess(key) {
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: this.cpI18n.transform(key)
      })
    );
  }

  caseLinkClickHandler(userId: number): void {
    if (!canSchoolWriteResource(this.session.g, CP_PRIVILEGES_MAP.contact_trace_cases)) {
      this.store.dispatch(
        new baseActionClass.SnackbarError({
          body: this.cpI18n.transform('contact_trace_exposure_notification_not_authorized')
        })
      );
      return;
    }
    const params = new HttpParams()
      .append('user_id', userId.toString())
      .append('school_id', this.session.g.get('school').id);

    const stream$ = this.casesService.getCaseById(params);

    stream$
      .toPromise()
      .then((cases: ICase[]) => {
        this.router.navigate(['/contact-trace/cases/', cases[0].id]);
      })
      .catch((reason) => {
        this.store.dispatch(
          new baseActionClass.SnackbarError({
            body: this.cpI18n.transform('contact_trace_exposure_notification_case_not_available')
          })
        );
      });
  }

  onDeleteClick(result: ExposureNotification) {
    this.deleteModal = this.modalService.open(ExposureNotificationDeleteComponent, {
      data: result,
      onAction: this.onDeletedNotification.bind(this),
      onClose: this.resetModal.bind(this)
    });
  }

  resetModal() {
    this.deleteModal.dispose();
  }
}
