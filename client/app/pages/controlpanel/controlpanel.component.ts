import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { BaseComponent } from '../../base';
// import { appStorage } from '../../shared/utils';
// import { PrivilegeService } from '../../shared/services';

@Component({
  selector: 'cp-controlpanel',
  styleUrls: ['./controlpanel.component.scss'],
  templateUrl: './controlpanel.component.html',
})
export class ControlPanelComponent extends BaseComponent implements OnInit {
  status;
  privileges;
  loading = true;

  constructor(
    private store: Store<any>,
    // private service: PrivilegeService
  ) {
    super();

    super.isLoading().subscribe(res => this.loading = res);

    // this.fetch();

    this.status = this.store.select('MOBILE');
  }

  // private fetch() {
  //   super
  //     .fetchData(this.service.getPrivileges())
  //     .then(res => {
  //       this.privileges = res.data.privilege_types;
  //       appStorage.set(appStorage.keys.PRIVILEGES, JSON.stringify(this.privileges));
  //     })
  //     .catch(err => console.error(err));
  // }

  ngOnInit() { }
}
