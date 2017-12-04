import { Component, OnInit } from '@angular/core';

import { CPSession, IUser } from '../../../session';
import { CPI18nService } from '../../../shared/services/index';

// interface IState {
//   startDate: number,
//   endDate: number,
// }

@Component({
  selector: 'cp-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  user: IUser;
  headerData;

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
  ) {
    this.user = this.session.g.get('user');
  }

  ngOnInit() {
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
}
