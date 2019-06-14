import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '@campus-cloud/base';
import { CPSession, IUser } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-dashboard',
  template: `
    <cp-page-header [data]="headerData"></cp-page-header>
    <router-outlet></router-outlet>
  `
})
export class DashboardComponent extends BaseComponent implements OnInit {
  dateRanges;
  headerData;
  user: IUser;
  loading = true;
  canAssess = false;
  currentDate = null;
  canViewClub = false;
  datePickerClass = 'primary dropdown-toggle';

  state = {
    experiences: []
  };

  constructor(public session: CPSession, public cpI18n: CPI18nService) {
    super();
  }

  updateHeader() {
    const hello = this.cpI18n.translate('hello');
    const username = `[NOTRANSLATE]${this.user.firstname}[NOTRANSLATE]`;
    const heading = `${hello} ${username}!`;

    this.headerData = {
      heading,
      crumbs: {
        url: null,
        label: null
      },
      subheading: null,
      em: null,
      children: []
    };
  }

  ngOnInit() {
    this.user = this.session.g.get('user');

    this.updateHeader();
  }
}
