import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { OnInit, Component, OnDestroy } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { map, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { PriorityToLabelPipe } from '../pipes';
import { CPSession } from '@campus-cloud/session';
import { baseActionClass } from '@campus-cloud/store';
import { baseActions } from '@campus-cloud/store/base';
import { FORMAT } from '@campus-cloud/shared/pipes/date';
import { ISnackbar, IHeader } from '@campus-cloud/store';
import { Paginated } from '@campus-cloud/shared/utils/http';
import { CPI18nService } from '@campus-cloud/shared/services';
import { AnnouncementStatus, IAnnouncement } from './../model';
import { AnnouncementsService } from './../announcements.service';
import { ModalService, CPLogger } from '@campus-cloud/shared/services';
import { AnnouncementDeleteComponent } from './../delete/announcements-delete.component';

@Component({
  selector: 'cp-announcement-scheduled',
  templateUrl: './scheduled.component.html',
  styleUrls: ['./scheduled.component.scss'],
  providers: [PriorityToLabelPipe]
})
export class AnnouncementScheduledComponent extends Paginated implements OnInit, OnDestroy {
  state = {
    loading: false,
    priority: null,
    searchStr: null,
    pageNext: false,
    announcements: [],
    pagePrevious: false,
    sortDirection: 'desc',
    sortField: 'notify_at_epoch'
  };

  modal: OverlayRef;
  destroy$ = new Subject();
  dateFormat = FORMAT.DATETIME;

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private modalService: ModalService,
    private service: AnnouncementsService,
    private store: Store<ISnackbar | IHeader>
  ) {
    super();
  }

  ngOnInit() {
    this.fetch();
    this.buildHeader();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onNavigate(newPage: number) {
    this.page = +newPage;
    this.fetch();
  }

  doFilter({ query, type }) {
    this.state = {
      ...this.state,
      priority: type,
      searchStr: query
    };

    if (this.state.searchStr && this.page > 1) {
      this.page = 1;
    }

    this.fetch();
  }

  handleSort(sortField: string) {
    this.state = {
      ...this.state,
      sortField,
      sortDirection: this.state.sortDirection === 'asc' ? 'desc' : 'asc'
    };
    this.fetch();
  }

  onAnnouncementDeleted(deletedId: number) {
    this.state = {
      ...this.state,
      announcements: this.state.announcements.filter((a: IAnnouncement) => a.id !== deletedId)
    };
  }

  onDeleteModalTeardown() {
    this.modalService.close(this.modal);
    this.modal = null;
  }

  onDelete(announcement: IAnnouncement) {
    this.modal = this.modalService.open(
      AnnouncementDeleteComponent,
      {},
      {
        data: announcement,
        onClose: this.onDeleteModalTeardown.bind(this),
        onAction: this.onAnnouncementDeleted.bind(this)
      }
    );
  }

  // setRows(data: IAnnouncement[]): Array<CPTableRow>[] {
  //   return data.map((announcement: IAnnouncement) => {
  //     const { priority, notify_at_epoch } = announcement;
  //     return [
  //       { template: this.customMainCell, context: { ...announcement } },
  //       { label: this.priorityToLabelPipe.transform(priority) },
  //       {
  //         label: this.cpDatePipe.transform(notify_at_epoch, this.dateFormat)
  //       },
  //       { template: this.customActionCell, context: { ...announcement } }
  //     ];
  //   });
  // }

  // setColumns() {
  //   return [
  //     { label: this.cpI18n.translate('recipient') },
  //     { label: this.cpI18n.translate('announcements_type') },
  //     {
  //       sortable: true,
  //       onClick: this.handleSort.bind(this, 'notify_at_epoch'),
  //       sorting: this.state.sortField === 'notify_at_epoch',
  //       label: this.cpI18n.translate('t_notify_scheduled_for'),
  //       sortingDirection: this.state.sortDirection
  //     },
  //     { label: '' }
  //   ];
  // }

  fetch() {
    this.state = {
      ...this.state,
      loading: true
    };
    const statuses = [AnnouncementStatus.error, AnnouncementStatus.pending];
    const search = new HttpParams()
      .set('statuses', statuses.join(','))
      .set('priority', this.state.priority)
      .set('search_str', this.state.searchStr)
      .set('sort_field', this.state.sortField)
      .set('sort_direction', this.state.sortDirection)
      .set('school_id', this.session.school.id.toString());

    this.service
      .getAnnouncements(search, this.startRage, this.endRange)
      .pipe(
        takeUntil(this.destroy$),
        map((data: any[]) => this.paginateResults(data))
      )
      .subscribe(
        (response) => {
          const { data, next, previous } = response;
          this.state = {
            ...this.state,
            pageNext: next,
            loading: false,
            announcements: data,
            pagePrevious: previous
          };
        },
        (error: HttpErrorResponse) => {
          this.errorHandler(error);
          this.state = {
            ...this.state,
            loading: false,
            announcements: []
          };
        }
      );
  }

  buildHeader() {
    Promise.resolve().then(() => {
      this.store.dispatch({
        type: baseActions.HEADER_UPDATE,
        payload: require('../../notify.header.json')
      });
    });
  }

  errorHandler(error: HttpErrorResponse) {
    CPLogger.log(`Error: AnnouncementScheduledComponent ${error.message}`);
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
  }
}
