import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { JobsService } from '../jobs.service';
import { CPSession } from '@campus-cloud/session';
import { CPDate } from '@campus-cloud/shared/utils';
import { JobsTypeDesireStudy } from '../jobs.status';
import { JobsUtilsService } from '../jobs.utils.service';
import { CPI18nService } from '@campus-cloud/shared/services';
import { EmployerService } from '../employers/employer.service';
import { baseActions, IHeader } from '../../../../../store/base';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { JobsAmplitudeService } from '@controlpanel/manage/jobs/jobs.amplitude.service';

@Component({
  selector: 'cp-jobs-create',
  templateUrl: './jobs-create.component.html',
  styleUrls: ['./jobs-create.component.scss']
})
export class JobsCreateComponent implements OnInit {
  data;
  formError;
  disableButton = true;
  isNewEmployer;
  form: FormGroup;
  dateErrorMessage;
  employerForm: FormGroup;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public service: JobsService,
    public store: Store<IHeader>,
    public cpI18n: CPI18nService,
    public utils: JobsUtilsService,
    private cpTracking: CPTrackingService,
    public employerService: EmployerService
  ) {}

  onSubmit() {
    this.formError = false;

    if (!this.utils.isOnGoing(this.data.job)) {
      if (this.data.job.posting_end <= this.data.job.posting_start) {
        this.formError = true;
        this.dateErrorMessage = this.cpI18n.translate('jobs_error_end_date_before_start');

        return;
      }

      if (this.data.job.posting_end <= Math.round(CPDate.now(this.session.tz).unix())) {
        this.formError = true;
        this.dateErrorMessage = this.cpI18n.translate('jobs_error_end_date_after_now');

        return;
      }
    }

    if (this.isNewEmployer) {
      this.createJobWithNewEmployer(this.data);
    } else {
      this.createJob(this.data);
    }
  }

  createJob(data) {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    this.service.createJob(data.job, search).subscribe((job: any) => {
      this.cpTracking.amplitudeEmitEvent(
        amplitudeEvents.MANAGE_CREATED_ITEM,
        JobsAmplitudeService.getItemProperties(job)
      );
      this.router.navigate([`/manage/jobs/${job.id}/info`]);
    });
  }

  createJobWithNewEmployer(data) {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    this.employerService
      .createEmployer(data.employer, search)
      .pipe(
        switchMap((employer: any) => {
          data.job.store_id = employer.id;

          return this.service.createJob(data.job, search);
        })
      )
      .subscribe(
        (job: any) => this.router.navigate([`/manage/jobs/${job.id}/info`]),
        (_) => this.flashMessageError()
      );
  }

  flashMessageError() {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        class: 'danger',
        autoClose: true,
        body: this.cpI18n.translate('something_went_wrong')
      }
    });
  }

  buildHeader() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: `jobs_create_job`,
        subheading: null,
        em: null,
        children: []
      }
    });
  }

  buildEmployerForm() {
    this.employerForm = this.fb.group({
      name: [null],
      description: [null],
      email: [null],
      logo_url: [null]
    });
  }

  formData(data) {
    this.data = data;
    const isFormValid = data.jobFormValid && data.employerFormValid;
    this.disableButton = !isFormValid;
  }

  onToggleEmployer(value) {
    this.isNewEmployer = value;
  }

  buildForm() {
    this.form = this.fb.group(
      {
        title: [null, [Validators.required, Validators.maxLength(120)]],
        store_id: [null, Validators.required],
        description: [null],
        how_to_apply: [null],
        posting_start: [null, Validators.required],
        posting_end: [null, Validators.required],
        contract_start: [null],
        application_deadline: [null],
        location: [null],
        is_ug_y1: [JobsTypeDesireStudy.disabled],
        is_ug_y2: [JobsTypeDesireStudy.disabled],
        is_ug_y3: [JobsTypeDesireStudy.disabled],
        is_ug_y4: [JobsTypeDesireStudy.disabled],
        is_masters: [JobsTypeDesireStudy.disabled],
        is_phd: [JobsTypeDesireStudy.disabled],
        is_full_time: [JobsTypeDesireStudy.disabled],
        is_part_time: [JobsTypeDesireStudy.disabled],
        is_summer: [JobsTypeDesireStudy.disabled],
        is_internship: [JobsTypeDesireStudy.disabled],
        is_credited: [JobsTypeDesireStudy.disabled],
        is_volunteer: [JobsTypeDesireStudy.disabled],
        is_oncampus: [JobsTypeDesireStudy.disabled],
        ongoing: [false]
      },
      { validator: this.utils.jobOngoingValidator }
    );
  }

  ngOnInit() {
    this.buildForm();
    this.buildHeader();
    this.buildEmployerForm();
  }
}
