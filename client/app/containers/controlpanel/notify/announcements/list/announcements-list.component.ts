import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { CPSession } from '../../../../../session';
import { FORMAT } from '../../../../../shared/pipes/date';
import { AnnouncementsService } from '../announcements.service';
import { BaseComponent } from '../../../../../base/base.component';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

interface IState {
  messages: Array<any>;
  query: string;
  type: number;
}

const state: IState = {
  messages: [],
  query: null,
  type: null,
};

declare var $: any;

@Component({
  selector: 'cp-announcements-list',
  templateUrl: './announcements-list.component.html',
  styleUrls: ['./announcements-list.component.scss']
})
export class AnnouncementsListComponent extends BaseComponent implements OnInit {
  loading;
  messageType;
  isDeleteModal;
  isComposeModal;
  suggestions = [];
  state: IState = state;
  deleteAnnouncement = null;
  dateFormat = FORMAT.DATETIME;

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private service: AnnouncementsService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  onLauncDeleteModal(item) {
    this.isDeleteModal = true;
    this.deleteAnnouncement = item;

    setTimeout(() => { $('#deleteAnnouncementModal').modal(); }, 1);
  }

  doFilter(filter) {
    if (filter.type) {
      super.resetPagination();
    }

    this.state = Object.assign(
      {},
      this.state,
      {
        query: filter.query,
        type: filter.type
      }
    );

    if (filter.query) {
      this.resetPagination();
    }

    this.fetch();
  }

  onLaunchCreateModal() {
    this.isComposeModal = true;
    setTimeout(() => { $('#composeModal').modal(); }, 1);
  }

  onDeleted(id) {
    this.state = Object.assign(
      {},
      this.state,
      {
        messages: this.state.messages.filter(message => message.id !== id)
      }
    );

    if (this.state.messages.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
  }

  private fetch() {
    let search = new URLSearchParams();
    let type = this.state.type !== null ? this.state.type.toString() : null;

    search.append('priority', type);
    search.append('search_str', this.state.query);
    search.append('school_id', this.session.g.get('school').id.toString());

    super
      .fetchData(this.service.getAnnouncements(search, this.startRange, this.endRange))
      .then(res => this.state = Object.assign({}, this.state, { messages: res.data }))
      .catch(err => { throw new Error(err) });
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

  ngOnInit() {
    this.messageType = {
      0: this.cpI18n.translate('emergency'),
      1: this.cpI18n.translate('urgent'),
      2: this.cpI18n.translate('regular')
    };
  }
}
