import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { OverlayRef } from '@angular/cdk/overlay';
import { Store } from '@ngrx/store';

import { AnnouncementStatus } from './../model';
import { CPSession } from '@campus-cloud/session';
import { AnnouncementDeleteComponent } from '../delete';
import { FORMAT } from '@campus-cloud/shared/pipes/date';
import { AnnouncementsService } from '../announcements.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { baseActions, IHeader, baseActionClass } from '@campus-cloud/store/base';
import { CPI18nService, ModalService, CPTrackingService } from '@campus-cloud/shared/services';

interface IState {
  messages: Array<any>;
  query: string;
  type: number;
  sort_field: string;
  sort_direction: string;
}

const state: IState = {
  messages: [],
  query: null,
  type: null,
  sort_field: 'created_on_epoch',
  sort_direction: 'desc'
};

@Component({
  selector: 'cp-announcement-sent',
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.scss']
})
export class AnnouncementSentComponent extends BaseComponent implements OnInit {
  loading;
  buttonText;
  headerText;
  messageType;
  sortingLabels;
  suggestions = [];
  modal: OverlayRef;
  viewMoreRecipients = [];
  state: IState = state;
  deleteAnnouncement = null;
  dateFormat = FORMAT.DATETIME;
  isExternalToolTip = this.cpI18n.translate('t_announcements_list_external_source_tooltip');

  constructor(
    private session: CPSession,
    public store: Store<IHeader>,
    private cpI18n: CPI18nService,
    private modalService: ModalService,
    private service: AnnouncementsService,
    private cpTracking: CPTrackingService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };
    this.fetch();
  }

  onDeleteTeardown(withError = false) {
    this.modalService.close(this.modal);
    this.modal = null;

    if (withError) {
      this.errorHandler();
    }
  }

  errorHandler() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({ body: this.cpI18n.translate('something_went_wrong') })
    );
  }

  onLauncDeleteModal(item) {
    this.modal = this.modalService.open(
      AnnouncementDeleteComponent,
      {},
      {
        data: item,
        onAction: this.onDeleted.bind(this),
        onClose: this.onDeleteTeardown.bind(this)
      }
    );
  }

  doFilter(filter) {
    if (filter.type) {
      super.resetPagination();
    }

    this.state = Object.assign({}, this.state, {
      query: filter.query,
      type: filter.type
    });

    if (filter.query) {
      this.resetPagination();
    }

    this.fetch();
  }

  onViewMoreModal(recipients) {
    this.trackViewMoreEvent();
    this.buttonText = 'done';
    this.headerText = `(${recipients.length})
      ${this.cpI18n.translate('notify_announcement_recipient')}`;
    this.viewMoreRecipients = recipients;
    setTimeout(
      () => {
        $('#viewMoreModal').modal({ keyboard: true, focus: true });
      },

      1
    );
  }

  trackViewMoreEvent() {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.VIEWED_ITEM,
      this.cpTracking.getAmplitudeMenuProperties()
    );
  }

  onDeleted(id) {
    this.state = Object.assign({}, this.state, {
      messages: this.state.messages.filter((message) => message.id !== id)
    });

    if (this.state.messages.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
  }

  fetch() {
    const type = this.state.type !== null ? this.state.type.toString() : null;

    const search = new HttpParams()
      .set('priority', type)
      .set('statuses', AnnouncementStatus.success.toString())
      .set('search_str', this.state.query)
      .set('sort_field', this.state.sort_field)
      .set('sort_direction', this.state.sort_direction)
      .set('school_id', this.session.g.get('school').id.toString());

    super
      .fetchData(this.service.getAnnouncements(search, this.startRange, this.endRange))
      .then((res) => (this.state = Object.assign({}, this.state, { messages: res.data })));
  }

  onCreated() {
    this.fetch();
  }

  onPaginationNext() {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetch();
  }

  updateHeader() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: require('../../notify.header.json')
    });
  }

  ngOnInit() {
    this.fetch();
    this.updateHeader();

    this.messageType = {
      0: this.cpI18n.translate('emergency'),
      1: this.cpI18n.translate('urgent'),
      2: this.cpI18n.translate('regular')
    };

    this.sortingLabels = {
      sent: this.cpI18n.translate('sent')
    };
  }
}
