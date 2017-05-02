import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CPSession } from '../../session';
import { BaseComponent } from '../../base';
import { AdminService, SchoolService } from '../../shared/services';

@Component({
  selector: 'cp-controlpanel',
  styleUrls: ['./controlpanel.component.scss'],
  templateUrl: './controlpanel.component.html',
})
export class ControlPanelComponent extends BaseComponent implements OnInit {
  status;
  loading = true;

  constructor(
    private session: CPSession,
    private adminService: AdminService,
    private schoolService: SchoolService
  ) {
    super();

    super.isLoading().subscribe(res => this.loading = res);

    // if (!appStorage.get(appStorage.keys.PROFILE)) {
    //   this.fetch();
    // }
  }

  private fetch() {
    const admins$ = this.adminService.getAdmins(1, 1);
    const school$ = this.schoolService.getShool();
    const stream$ = Observable.combineLatest(admins$, school$);

    super
      .fetchData(stream$)
      .then(res => {
        this.session.user = res.data[0][0];
        this.session.school = res.data[1][0];
        // appStorage.set(appStorage.keys.PROFILE, JSON.stringify(res.data[0][0]));
      })
      .catch(err => console.error(err));
  }

  ngOnInit() {
    this.fetch();
    // if (!appStorage.get(appStorage.keys.PROFILE)) {
    //   this.fetch();
    // }
  }
}
