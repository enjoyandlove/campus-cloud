import { ActivatedRoute, Router, Params } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../../base';
import { CPSession, IUser } from '../../../session';
import { DashboardService } from './dashboard.service';
import { CPI18nService } from '../../../shared/services';
import { PersonaType } from './../audience/audience.status';
import { CP_PRIVILEGES_MAP } from '../../../shared/constants';
import { DashboardUtilsService } from './dashboard.utils.service';
import { canSchoolReadResource } from '../../../shared/utils/privileges';

@Component({
  selector: 'cp-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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

  constructor(
    public router: Router,
    public session: CPSession,
    public route: ActivatedRoute,
    public cpI18n: CPI18nService,
    public service: DashboardService,
    public helper: DashboardUtilsService
  ) {
    super();
  }

  readStateFromUrl(): void {
    const routeParams: any = this.route.snapshot.queryParams;

    this.currentDate = {
      ...this.currentDate,
      start: +routeParams.start,
      end: +routeParams.end,
      label: routeParams.label
    };
  }

  initState() {
    const defaultDate = this.helper.last30Days();
    const firstExperiences = this.state.experiences[1];

    this.currentDate = {
      ...this.currentDate,
      ...defaultDate
    };

    this.updateUrl({
      start: this.currentDate.start,
      end: this.currentDate.end,
      label: this.currentDate.label,
      cga_exp_id: firstExperiences.action
    });
  }

  updateUrl(params: Params): void {
    this.router.navigate(['/dashboard'], {
      queryParamsHandling: 'merge',
      queryParams: { ...params }
    });
  }

  onDateChange(newDate) {
    this.currentDate = {
      ...this.currentDate,
      ...newDate
    };

    this.updateUrl({
      start: this.currentDate.start,
      end: this.currentDate.end,
      label: this.currentDate.label
    });
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

  fetchPersonas() {
    const search = new HttpParams()
      .set('school_id', this.session.g.get('school').id)
      .set('platform', PersonaType.app.toString());

    return super.fetchData(this.service.getExperiences(search));
  }

  setUp() {
    const hasValidParams = this.helper.validParams(this.route.snapshot.queryParams);

    this.fetchPersonas()
      .then(({ data }) => {
        this.state = {
          ...this.state,
          experiences: data
        };

        return hasValidParams ? this.readStateFromUrl() : this.initState();
      })
      .then(() => {
        this.loading = false;
      });
  }

  ngOnInit() {
    this.user = this.session.g.get('user');

    this.dateRanges = [this.helper.last30Days(), this.helper.last90Days(), this.helper.lastYear()];

    this.canAssess = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.assessment);

    this.canViewClub = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.clubs);

    this.currentDate = this.helper.last30Days();

    this.setUp();

    this.updateHeader();

    this.route.queryParams.subscribe((params) => {
      const noParamsInUrl = !Object.keys(params).length;
      if (noParamsInUrl) {
        this.setUp();
      }
    });
  }
}
