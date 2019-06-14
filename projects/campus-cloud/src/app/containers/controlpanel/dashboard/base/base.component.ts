import { ActivatedRoute, Router, Params } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { IDateRange } from '@campus-cloud/shared/components';
import { CPI18nService } from '@campus-cloud/shared/services';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { DashboardService } from '../dashboard.service';
import { PersonaType } from '../../audience/audience.status';
import { DashboardUtilsService } from '../dashboard.utils.service';
import {
  canSchoolReadResource,
  canSchoolWriteResource
} from '@campus-cloud/shared/utils/privileges';

@Component({
  selector: 'cp-dashboard',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class DashboardBaseComponent extends BaseComponent implements OnInit {
  loading = true;
  canAssess = false;
  currentDate = null;
  canViewClub = false;
  canCustomize = false;
  dateRanges: IDateRange[];
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
    if (!this.state.experiences[1] && this.canCustomize) {
      this.router.navigate(['/dashboard/onboarding']);
    } else {
      const defaultDate = this.helper.last30Days();
      const firstExperiences = this.state.experiences[1];

      this.currentDate = {
        ...this.currentDate,
        ...defaultDate
      };

      let params: Params = {
        start: this.currentDate.start,
        end: this.currentDate.end,
        label: this.currentDate.label
      };

      if (firstExperiences) {
        params = {
          ...params,
          cga_exp_id: firstExperiences.action
        };
      }

      this.updateUrl(params);
    }
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
    this.dateRanges = [this.helper.last30Days(), this.helper.last90Days(), this.helper.lastYear()];

    this.canAssess = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.assessment);

    this.canViewClub = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.clubs);

    this.canCustomize = canSchoolWriteResource(this.session.g, CP_PRIVILEGES_MAP.app_customization);

    this.currentDate = this.helper.last30Days();

    this.setUp();

    this.route.queryParams.subscribe((params) => {
      const noParamsInUrl = !Object.keys(params).length;
      if (noParamsInUrl) {
        this.setUp();
      }
    });
  }
}
