import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { JobsService } from '../jobs.service';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { CPDate } from '../../../../../shared/utils';
import { CPI18nService } from '../../../../../shared/services';
import { EmployerService } from '../employers/employer.service';
import { SNACKBAR_SHOW } from '../../../../../reducers/snackbar.reducer';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-jobs-edit',
  templateUrl: './jobs-edit.component.html',
  styleUrls: ['./jobs-edit.component.scss']
})
export class JobsEditComponent extends BaseComponent implements OnInit {
  data;
  jobId;
  loading;
  formError;
  buttonData;
  isNewEmployer;
  dateErrorMessage;
  form: FormGroup;
  employerForm: FormGroup;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public service: JobsService,
    public route: ActivatedRoute,
    public store: Store<IHeader>,
    public cpI18n: CPI18nService,
    public employerService: EmployerService
  ) {
    super();
    this.jobId = this.route.snapshot.params['jobId'];
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  public fetch() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    super.fetchData(this.service.getJobById(this.jobId, search)).then((job) => {
      this.buildForm(job.data);
    });
  }

  onSubmit() {
    this.formError = false;

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

    if (this.isNewEmployer) {
      this.editJobWithNewEmployer(this.data);
    } else {
      this.editJob(this.data);
    }
  }

  editJob(data) {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    this.service
      .editJob(this.jobId, data.job, search)
      .subscribe(
        (job) => this.router.navigate([`/manage/jobs/${job.id}/info`]),
        (_) => this.flashMessageError()
      );
  }

  editJobWithNewEmployer(data) {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    this.employerService
      .createEmployer(data.employer, search)
      .switchMap((employer) => {
        data.job.store_id = employer.id;

        return this.service.editJob(this.jobId, data.job, search);
      })
      .subscribe(
        (job) => this.router.navigate([`/manage/jobs/${job.id}/info`]),
        (_) => this.flashMessageError()
      );
  }

  flashMessageError() {
    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        class: 'danger',
        autoClose: true,
        body: this.cpI18n.translate('something_went_wrong')
      }
    });
  }

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: `jobs_job_edit`,
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
    this.buttonData = Object.assign({}, this.buttonData, { disabled: !isFormValid });
  }

  onToggleEmployer(value) {
    this.isNewEmployer = value;
  }

  buildForm(job) {
    this.form = this.fb.group({
      title: [job.title, [Validators.required, Validators.maxLength(120)]],
      store_id: [job.store_id, Validators.required],
      description: [job.description],
      how_to_apply: [job.how_to_apply],
      posting_start: [job.posting_start, Validators.required],
      posting_end: [job.posting_end, Validators.required],
      contract_start: [job.contract_start],
      application_deadline: [job.application_deadline],
      location: [job.location],
      is_ug_y1: [job.is_ug_y1],
      is_ug_y2: [job.is_ug_y2],
      is_ug_y3: [job.is_ug_y3],
      is_ug_y4: [job.is_ug_y4],
      is_masters: [job.is_masters],
      is_phd: [job.is_phd],
      is_full_time: [job.is_full_time],
      is_part_time: [job.is_part_time],
      is_summer: [job.is_summer],
      is_internship: [job.is_internship],
      is_credited: [job.is_credited],
      is_volunteer: [job.is_volunteer],
      is_oncampus: [job.is_oncampus]
    });
  }

  ngOnInit() {
    this.fetch();
    this.buildHeader();
    this.buildEmployerForm();

    this.buttonData = {
      disabled: false,
      class: 'primary',
      text: this.cpI18n.translate('save')
    };
  }
}
