import { Component, OnInit } from '@angular/core';

import { CPSession, IUser } from '../../../session';
import { CPI18nService } from '../../../shared/services/index';
import { DashboardUtilsService } from './dashboard.utils.service';

@Component({
  selector: 'cp-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  user: IUser;
  headerData;
  currentDate = null;

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private helper: DashboardUtilsService
  ) {
    this.user = this.session.g.get('user');
  }

  onDateChange(newDate) {
    this.currentDate = newDate;
    console.log('date changed', this.currentDate);
  }

  updateHeader() {
    const hello = this.cpI18n.translate('hello')
    const username = `[NOTRANSLATE]${this.user.firstname}[NOTRANSLATE]`;
    const heading = `${hello} ${username}!`;

    this.headerData = {
      heading,
      'crumbs': {
        'url': null,
        'label': null
      },
      'subheading': null,
      'em': null,
      'children': []
    };
  }

  ngOnInit() {
    this.currentDate = this.helper.last30Days();

    this.updateHeader();
  }
}
