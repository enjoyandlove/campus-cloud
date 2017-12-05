import { Component, OnInit } from '@angular/core';

import { CPSession, IUser } from '../../../session';
import { CPI18nService } from '../../../shared/services';
import { CP_PRIVILEGES_MAP } from '../../../shared/constants';
import { DashboardUtilsService } from './dashboard.utils.service';
import { canSchoolReadResource } from '../../../shared/utils/privileges/index';

@Component({
  selector: 'cp-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  headerData;
  user: IUser;
  canAssess = false;
  currentDate = null;
  isSuperAdmin = false;

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private helper: DashboardUtilsService
  ) {
    this.user = this.session.g.get('user');
  }

  onDateChange(newDate) {
    this.currentDate = newDate;
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
    this.canAssess = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.assessment);
    this.currentDate = this.helper.last30Days();

    this.updateHeader();
  }
}
