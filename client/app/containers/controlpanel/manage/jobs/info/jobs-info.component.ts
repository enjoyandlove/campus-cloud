import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { IJob } from '../jobs.interface';
import { JobsService } from '../jobs.service';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { JobsUtilsService } from '../jobs.utils.service';
import { FORMAT } from '../../../../../shared/pipes/date';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';
import { CP_TRACK_TO } from '../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { CPTrackingService, RouteLevel } from '../../../../../shared/services';

@Component({
  selector: 'cp-jobs-info',
  templateUrl: './jobs-info.component.html',
  styleUrls: ['./jobs-info.component.scss']
})
export class JobsInfoComponent extends BaseComponent implements OnInit {
  jobId;
  loading;
  jobType;
  job: IJob;
  dateFormat;
  desiredYear;

  constructor(
    public session: CPSession,
    public service: JobsService,
    public route: ActivatedRoute,
    public store: Store<IHeader>,
    public utils: JobsUtilsService,
    public cpTracking: CPTrackingService
  ) {
    super();
    this.dateFormat = FORMAT.SHORT;
    this.jobId = this.route.snapshot.params['jobId'];
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  public fetch() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    super.fetchData(this.service.getJobById(this.jobId, search)).then((job) => {
      this.job = job.data;
      this.desiredYear = this.utils
        .getDesiredStudy(
          false,
          this.job.is_ug_y1,
          this.job.is_ug_y2,
          this.job.is_ug_y3,
          this.job.is_ug_y4,
          this.job.is_masters,
          this.job.is_phd
        )
        .map((study) => study.label);

      this.jobType = this.utils
        .getJobsType(
          false,
          this.job.is_full_time,
          this.job.is_part_time,
          this.job.is_internship,
          this.job.is_summer,
          this.job.is_credited,
          this.job.is_volunteer,
          this.job.is_oncampus
        )
        .map((type) => type.label);
    });
  }

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: `jobs_job_details`,
        subheading: null,
        em: null,
        crumbs: {
          url: `/manage/jobs`,
          label: `jobs`
        },
        children: []
      }
    });
  }

  trackChangeEvent() {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: this.cpTracking.activatedRoute(RouteLevel.fourth)
    };

    return {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CHANGE_BUTTON,
      eventProperties
    };
  }

  ngOnInit() {
    this.fetch();
    this.buildHeader();
  }
}
