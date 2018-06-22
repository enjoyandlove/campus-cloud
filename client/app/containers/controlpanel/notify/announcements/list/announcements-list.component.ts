import { Store } from '@ngrx/store';
import { HEADER_UPDATE, IHeader } from './../../../../../reducers/header.reducer';
import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '../../../../../session';
import { FORMAT } from '../../../../../shared/pipes/date';
import { AnnouncementsService } from '../announcements.service';
import { BaseComponent } from '../../../../../base/base.component';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

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
  sort_field: 'sent_time',
  sort_direction: 'desc'
};

declare var $: any;

@Component({
  selector: 'cp-announcements-list',
  templateUrl: './announcements-list.component.html',
  styleUrls: ['./announcements-list.component.scss']
})
export class AnnouncementsListComponent extends BaseComponent implements OnInit {
  loading;
  buttonText;
  headerText;
  messageType;
  isDeleteModal;
  suggestions = [];
  viewMoreRecipients = [];
  state: IState = state;
  deleteAnnouncement = null;
  dateFormat = FORMAT.DATETIME;

  constructor(
    private session: CPSession,
    public store: Store<IHeader>,
    private cpI18n: CPI18nService,
    private service: AnnouncementsService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));

    this.fetch();
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };

    this.fetch();
  }

  onLauncDeleteModal(item) {
    this.isDeleteModal = true;
    this.deleteAnnouncement = item;

    setTimeout(
      () => {
        $('#deleteAnnouncementModal').modal();
      },

      1
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
    this.buttonText = 'done';
    this.headerText = `(${recipients.length})
      ${this.cpI18n.translate('notify_announcement_recipient')}`;
    this.viewMoreRecipients = recipients;
    setTimeout(
      () => {
        $('#viewMoreModal').modal();
      },

      1
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

  private fetch() {
    const type = this.state.type !== null ? this.state.type.toString() : null;

    const search = new HttpParams()
      .append('priority', type)
      .append('search_str', this.state.query)
      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction)
      .append('school_id', this.session.g.get('school').id.toString());

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
      type: HEADER_UPDATE,
      payload: require('../../notify.header.json')
    });
  }

  ngOnInit() {
    this.updateHeader();

    this.messageType = {
      0: this.cpI18n.translate('emergency'),
      1: this.cpI18n.translate('urgent'),
      2: this.cpI18n.translate('regular')
    };
  }
}
