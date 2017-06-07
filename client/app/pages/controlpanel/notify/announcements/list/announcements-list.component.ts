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
  userSerch: boolean;
  listSearch: boolean;
}

const state: IState = {
  messages: [],
  query: null,
  type: null,
  userSerch: true,
  listSearch: false,
};

declare var $: any;

@Component({
  selector: 'cp-announcements-list',
  templateUrl: './announcements-list.component.html',
  styleUrls: ['./announcements-list.component.scss']
})
export class AnnouncementsListComponent extends BaseComponent implements OnInit {
  loading;
  suggestions = [];
  state: IState = state;
  dateFormat = FORMAT.DATETIME;

  constructor(
    private session: CPSession,
    private service: AnnouncementsService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  private doUserSearch(query) {
    let search = new URLSearchParams();
    search.append('search_str', query);
    search.append('school_id', this.session.school.id.toString());

    this
      .service
      .getUsers(search)
      .map(users => {
        let _users = [];

        users.forEach(user => {
          _users.push({
            'label': `${user.firstname} ${user.lastname}`,
            'id': user.id
          });
        });

        if (!_users.length) {
          _users.push({ 'label': 'No Results...' });
        }

        return _users;
      })
      .subscribe(
        res => this.suggestions = res,
        err => console.log(err)
      );
  }

  onSearch(query) {
    if (this.state.userSerch) {
      this.doUserSearch(query);
    }
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
