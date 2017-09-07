import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';


import { AdminService } from '../../../../../shared/services';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

interface IState {
  admins: Array<any>;
  search_str: string;
}

const state: IState = {
  admins: [],
  search_str: null
};

declare var $: any;

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
    private session: CPSession,
    private store: Store<IHeader>,
    private adminService: AdminService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  onSearch(search_str) {
    this.state = Object.assign({}, this.state, { search_str });

    this.fetch();
  }

  private fetch() {
    let search = new URLSearchParams();
    search.append('search_str', this.state.search_str);
    search.append('school_id', this.session.school.id.toString());

    super
      .fetchData(this.adminService.getAdmins(this.startRange, this.endRange, search))
      .then(res => {
        this.state = Object.assign({}, this.state, { admins: res.data });
      })
      .catch(_ => {}
      );
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../team.header.json')
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
    $('#teamErrorModal').modal();
  }

  onDeleted(adminId) {
    this.state = Object.assign(
      {},
      this.state,
      { admins: this.state.admins.filter(admin => admin.id !== adminId) }
    );
  }

  ngOnInit() {
    this.buildHeader();
  }
}
