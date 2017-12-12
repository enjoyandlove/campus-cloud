import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { CPSession, IUser } from '../../../session';
import { CPI18nService } from '../../../shared/services';
import { CP_PRIVILEGES_MAP } from '../../../shared/constants';
import { DashboardUtilsService } from './dashboard.utils.service';
import { canSchoolReadResource } from '../../../shared/utils/privileges';

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
    private router: Router,
    private session: CPSession,
    private route: ActivatedRoute,
    private cpI18n: CPI18nService,
    private helper: DashboardUtilsService
  ) {
    this.user = this.session.g.get('user');
  }

  readStateFromUrl(): void {
    const routeParams: any = this.route.snapshot.queryParams;

    this.currentDate = Object.assign(
      {},
      this.currentDate,
      {
        'start': +routeParams.start,
        'end': +routeParams.end,
        'label': routeParams.label
      }
    );
  }

  initState() {
    const defaultDate = this.helper.last30Days();

    this.currentDate = Object.assign(
      {},
      this.currentDate,
      { ...defaultDate }
    );

    this.updateUrl();
  }

  updateUrl(): void {
    this
      .router
      .navigate(
      ['/dashboard'],
      {
        queryParams: {
          'start': this.currentDate.start,
          'end': this.currentDate.end,
          'label': this.currentDate.label
        }
      }
      );
  }

  onDateChange(newDate) {
    this.currentDate = newDate;
    this.updateUrl();
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
    this.isSuperAdmin = true;
    this.canAssess = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.assessment);
    this.currentDate = this.helper.last30Days();

    if (this.route.snapshot.queryParams['start'] &&
      this.route.snapshot.queryParams['end'] &&
      this.route.snapshot.queryParams['label']) {
      this.readStateFromUrl();
    } else {
      this.initState();
    }

    this.updateHeader();
  }
}
