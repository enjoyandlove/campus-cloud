import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { CPSession } from '../../../../../session';
import { FORMAT } from '../../../../../shared/pipes/date.pipe';
import { AnnouncementsService } from '../announcements.service';
import { BaseComponent } from '../../../../../base/base.component';

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
  suggestions = [];
  state: IState = state;
  deleteAnnoucement = null;
  dateFormat = FORMAT.DATETIME;

  constructor(
    private session: CPSession,
    private service: AnnouncementsService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  doFilter(filter) {
    this.state = Object.assign(
      {},
      this.state,
      {
        query: filter.query,
        type: filter.type
      }
    );

    this.fetch();
  }

  onLaunchCreateModal() {
    $('#composeModal').modal();
  }

  onDeleted(id) {
    this.state = Object.assign(
      {},
      this.state,
      {
        messages: this.state.messages.filter(message => message.id !== id)
      }
    );
  }

  private fetch() {
    let search = new URLSearchParams();
    let type = this.state.type !== null ? this.state.type.toString() : null;

    search.append('priority', type);
    search.append('search_str', this.state.query);
    search.append('school_id', this.session.school.id.toString());

    super
      .fetchData(this.service.getAnnouncements(search, this.startRange, this.endRange))
      .then(res => this.state = Object.assign({}, this.state, { messages: res.data }))
      .catch(err => console.log(err));
  }

  onCreated(notification) {
    console.log('I am pushing this to the array', notification);
    // this.state.messages = Object.assign(
    //   {},
    //   this.state.messages,
    //   { notification, ...this.state.messages }
    // );
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
      0: 'Emergency',
      1: 'Urgent',
      2: 'Normal',
    };
  }
}
