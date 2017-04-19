import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

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
  type: null
};

declare var $: any;

@Component({
  selector: 'cp-announcements-list',
  templateUrl: './announcements-list.component.html',
  styleUrls: ['./announcements-list.component.scss']
})
export class AnnouncementsListComponent extends BaseComponent implements OnInit {
  loading;
  state: IState = state;
  dateFormat = FORMAT.DATETIME;

  constructor(
    private service: AnnouncementsService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  doFilter(data) {
    this.state = Object.assign(
      {},
      this.state,
      {
        query: data.query,
        type: data.query
      }
    );

    this.fetch();
  }

  onLaunchCreateModal() {
    $('#composeModal').modal();
  }

  private fetch() {
    let search = new URLSearchParams();
    let type = this.state.type ? this.state.type.toString() : null;

    search.append('type', type);
    search.append('query', this.state.query);

    super
      .fetchData(this.service.getAnnouncements(search))
      .then(res => this.state = Object.assign({}, this.state, { messages: res.data }))
      .catch(err => console.log(err));
  }

  ngOnInit() { }
}
