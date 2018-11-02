import { PersonaType } from './../audience/audience.status';
import { HttpParams } from '@angular/common/http';
import { DashboardService } from './dashboard.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardUtilsService } from './dashboard.utils.service';
import { CPSession, IUser } from '../../../session';
import { CP_PRIVILEGES_MAP } from '../../../shared/constants';
import { CPI18nService } from '../../../shared/services';
import { canSchoolReadResource } from '../../../shared/utils/privileges';
import { BaseComponent } from '../../../base';

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
    personas: [],
    currentDate: null,
    campusAppCardEperience: null,
    generalInfoCardExperience: null
  };

  constructor(
    private router: Router,
    private session: CPSession,
    private route: ActivatedRoute,
    private cpI18n: CPI18nService,
    public service: DashboardService,
    private helper: DashboardUtilsService
  ) {
    super();
    this.user = this.session.g.get('user');
  }

  readStateFromUrl(): void {
    const routeParams: any = this.route.snapshot.queryParams;

    const campusAppCardEperience = this.state.personas.filter(
      (p) => p.action === +routeParams.c_activity_exp_id
    );

    const generalInfoCardExperience = this.state.personas.filter(
      (p) => p.action === +routeParams.gen_info_exp_id
    );

    this.state = {
      ...this.state,
      campusAppCardEperience,
      generalInfoCardExperience
    };

    this.currentDate = Object.assign({}, this.currentDate, {
      start: +routeParams.start,
      end: +routeParams.end,
      label: routeParams.label
    });
  }

  initState() {
    this.state = {
      ...this.state,
      campusAppCardEperience: this.state.personas[1],
      generalInfoCardExperience: this.state.personas[1]
    };

    const defaultDate = this.helper.last30Days();

    this.currentDate = Object.assign({}, this.currentDate, { ...defaultDate });

    this.updateUrl();
  }

  updateUrl(): void {
    this.router.navigate(['/dashboard'], {
      queryParams: {
        start: this.currentDate.start,
        end: this.currentDate.end,
        label: this.currentDate.label,
        gen_info_exp_id: this.state.generalInfoCardExperience.action,
        c_activity_exp_id: this.state.campusAppCardEperience.action
      }
    });
  }

  onDateChange(newDate) {
    this.currentDate = newDate;
    this.updateUrl();
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

    return super.fetchData(this.service.getPersonas(search));
  }

  setUp() {
    const noParamsInUrl = !Object.keys(this.route.snapshot.queryParams).length;

    this.fetchPersonas()
      .then(({ data }) => {
        this.state = {
          ...this.state,
          personas: data
        };
        if (noParamsInUrl) {
          this.initState();
        } else {
          this.readStateFromUrl();
        }
      })
      .then(() => (this.loading = false));
  }

  ngOnInit() {
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
