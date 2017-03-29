import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AdminService } from '../../../../../shared/services';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent extends BaseComponent implements OnInit {
  admins;
  loading;
  deleteAdmin = '';

  constructor(
    private store: Store<IHeader>,
    private adminService: AdminService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  private fetch() {
    super
      .fetchData(this.adminService.getAdmins())
      .then(res => {
        this.admins = res.data;
        console.log(this);
      })
      .catch(err => console.error(err));
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../team.header.json')
    });
  }

  ngOnInit() {
    this.buildHeader();
  }
}
