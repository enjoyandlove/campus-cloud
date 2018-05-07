import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { CPSession } from '../../../../../session';
import { AdminService } from '../../../../../shared/services';
import { BaseComponent } from '../../../../../base/base.component';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

interface IState {
  admins: Array<any>;
  search_str: string;
  sort_field: string;
  sort_direction: string;
}

const state: IState = {
  admins: [],
  search_str: null,
  sort_field: 'firstname',
  sort_direction: 'asc'
};

@Component({
  selector: 'cp-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent extends BaseComponent implements OnInit {
  admins;
  loading;
  deleteAdmin = '';
  state: IState = state;

  constructor(
    public session: CPSession,
    public store: Store<IHeader>,
    public cpI18n: CPI18nService,
    public adminService: AdminService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));

    this.fetch();
  }

  onSearch(search_str) {
    this.state = Object.assign({}, this.state, { search_str });

    this.resetPagination();

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

  private fetch() {
    const search = new URLSearchParams();
    search.append('search_str', this.state.search_str);
    search.append('sort_field', this.state.sort_field);
    search.append('sort_direction', this.state.sort_direction);
    search.append('school_id', this.session.g.get('school').id.toString());

    super
      .fetchData(this.adminService.getAdmins(this.startRange, this.endRange, search))
      .then((res) => {
        this.state = Object.assign({}, this.state, { admins: res.data });
      })
      .catch((_) => {});
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../../settings.header.json')
    });
  }

  onPaginationNext() {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetch();
  }

  onForbidden() {
    $('#teamUnauthorziedModal').modal();
  }

  onDeleted(adminId) {
    this.state = Object.assign({}, this.state, {
      admins: this.state.admins.filter((admin) => admin.id !== adminId)
    });

    if (this.state.admins.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
  }

  ngOnInit() {
    this.buildHeader();
  }
}
