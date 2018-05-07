import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { JobsService } from '../jobs.service';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { EmployerService } from '../employers/employer.service';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-jobs-edit',
  templateUrl: './jobs-edit.component.html',
  styleUrls: ['./jobs-edit.component.scss']
})
export class JobsEditComponent extends BaseComponent implements OnInit {
  @ViewChild('editForm') editForm;

  jobId;
  loading;
  form: FormGroup;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public service: JobsService,
    public route: ActivatedRoute,
    public store: Store<IHeader>,
    public employerService: EmployerService
  ) {
    super();
    this.jobId = this.route.snapshot.params['jobId'];
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  public fetch() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    super.fetchData(this.service.getJobById(this.jobId, search)).then((job) => {
      this.buildForm(job.data);
    });
  }

  onSave(data) {
    if (data.isNewEmployer) {
      this.editJobWithNewEmployer(data);
    } else {
      this.editJob(data);
    }
  }

  editJob(data) {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    this.service
      .editJob(this.jobId, data.job, search)
      .subscribe((job) => this.router.navigate([`/manage/jobs/${job.id}/info`]));
  }

  editJobWithNewEmployer(data) {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    this.employerService
      .createEmployer(data.employer, search)
      .switchMap((employer) => {
        data.job.store_id = employer.id;

        return this.service.editJob(this.jobId, data.job, search);
      })
      .subscribe((job) => {
        this.router.navigate([`/manage/jobs/${job.id}/info`]);
      });
  }

  isStoreRequired(value) {
    const store_id = this.form.controls['store_id'].value;
    this.form.setControl('store_id', new FormControl(store_id, value ? Validators.required : null));
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
  }
}
