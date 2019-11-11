import { OnInit, Component, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { map, tap, takeUntil } from 'rxjs/operators';
import { OverlayRef } from '@angular/cdk/overlay';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { PriorityToLabelPipe } from '../pipes';
import { CPSession } from '@campus-cloud/session';
import { baseActionClass } from '@campus-cloud/store';
import { baseActions } from '@campus-cloud/store/base';
import { ISnackbar, IHeader } from '@campus-cloud/store';
import { CPI18nService } from '@campus-cloud/shared/services';
import { AnnouncementStatus, IAnnouncement } from './../model';
import { AnnouncementsService } from './../announcements.service';
import { FORMAT, CPDatePipe } from '@campus-cloud/shared/pipes/date';
import { Paginated, PaginatedResult } from '@campus-cloud/shared/utils/http';
import { AnnouncementDeleteComponent } from './../delete/announcements-delete.component';
import { ModalService, CPLogger, CPTrackingService } from '@campus-cloud/shared/services';
import {
  CPTableRow,
  CPTableColumn,
  CPTableSorting
} from '@campus-cloud/shared/components/cp-table/interfaces';

@Component({
  selector: 'cp-announcement-scheduled',
  templateUrl: './scheduled.component.html',
  styleUrls: ['./scheduled.component.scss'],
  providers: [PriorityToLabelPipe]
})
export class AnnouncementScheduledComponent extends Paginated implements OnInit, OnDestroy {
  @ViewChild('customActionCell', { static: true, read: TemplateRef })
  private customActionCell: TemplateRef<any>;

  @ViewChild('customMainCell', { static: true, read: TemplateRef })
  private customMainCell: TemplateRef<any>;

  state = {
    loading: false,
    priority: null,
    searchStr: null,
    pageNext: false,
    announcements: [],
    pagePrevious: false,
    sortField: 'notify_at_epoch',
    sortDirection: CPTableSorting.desc
  };

  modal: OverlayRef;
  destroy$ = new Subject();
  dateFormat = FORMAT.DATETIME;
  columns: CPTableColumn[] = [];
  rows: Array<CPTableRow>[] = [];

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private cpDatePipe: CPDatePipe,
    private modalService: ModalService,
    private service: AnnouncementsService,
    private cpTracking: CPTrackingService,
    private store: Store<ISnackbar | IHeader>,
    private priorityToLabelPipe: PriorityToLabelPipe
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
      sortDirection:
        this.state.sortDirection === CPTableSorting.asc ? CPTableSorting.desc : CPTableSorting.asc
    };
    this.fetch();
  }

  onAnnouncementDeleted(deletedId: number) {
    const deletedAnnouncement = this.state.announcements.find((a) => a.id === deletedId);
    this.state = {
      ...this.state,
      announcements: this.state.announcements.filter((a: IAnnouncement) => a.id !== deletedId)
    };

    this.rows = this.setRows(this.state.announcements);
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

  setRows(data: IAnnouncement[]): Array<CPTableRow>[] {
    return data.map((announcement: IAnnouncement) => {
      const { priority, notify_at_epoch } = announcement;
      return [
        { template: this.customMainCell, context: { ...announcement } },
        { label: this.priorityToLabelPipe.transform(priority) },
        {
          label: this.cpDatePipe.transform(notify_at_epoch, this.dateFormat)
        },
        { template: this.customActionCell, context: { ...announcement } }
      ];
    });
  }

  setColumns() {
    return [
      { label: this.cpI18n.translate('recipient') },
      { label: this.cpI18n.translate('announcements_type') },
      {
        sortable: true,
        onClick: this.handleSort.bind(this, 'notify_at_epoch'),
        sorting: this.state.sortField === 'notify_at_epoch',
        label: this.cpI18n.translate('t_notify_scheduled_for'),
        sortingDirection: this.state.sortDirection
      },
      { label: '' }
    ];
  }

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
        map((data: any[]) => this.paginateResults(data)),
        tap((response: PaginatedResult<any>) => {
          const { data, next, previous } = response;
          this.state = {
            ...this.state,
            pageNext: next,
            loading: false,
            announcements: data,
            pagePrevious: previous
          };
        }),
        map(({ data }: PaginatedResult<any>) => {
          return {
            rows: this.setRows(data),
            columns: this.setColumns()
          };
        })
      )
      .subscribe(
        ({ rows, columns }) => {
          this.rows = rows;
          this.columns = columns;
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
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: require('../../notify.header.json')
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
