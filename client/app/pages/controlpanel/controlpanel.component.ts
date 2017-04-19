import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { BaseComponent } from '../../base';
import { appStorage } from '../../shared/utils';
import { AdminService } from '../../shared/services';

@Component({
  selector: 'cp-controlpanel',
  styleUrls: ['./controlpanel.component.scss'],
  templateUrl: './controlpanel.component.html',
})
export class ControlPanelComponent extends BaseComponent implements OnInit {
  status;
  loading = true;

  constructor(
    private store: Store<any>,
    private service: AdminService
  ) {
    super();

    super.isLoading().subscribe(res => this.loading = res);

    if (!appStorage.get(appStorage.keys.PROFILE)) {
      this.fetch();
    }

    this.status = this.store.select('MOBILE');
  }

  private fetch() {
    super
      .fetchData(this.service.getAdmins(this.startRange, this.endRange))
      .then(res => {
        appStorage.set(appStorage.keys.PROFILE, JSON.stringify(res.data[0]));
      })
      .catch(err => console.error(err));
  }

  ngOnInit() { }
}
