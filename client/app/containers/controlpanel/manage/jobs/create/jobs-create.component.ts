import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { JobsService } from '../jobs.service';
import { CPSession } from '../../../../../session';
import { JobsTypeDesireStudy } from '../jobs.status';
import { EmployerService } from '../employers/employer.service';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-jobs-create',
  templateUrl: './jobs-create.component.html',
  styleUrls: ['./jobs-create.component.scss']
})
export class JobsCreateComponent implements OnInit {
  @ViewChild('createForm') createForm;

  form: FormGroup;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public service: JobsService,
    public store: Store<IHeader>,
    public employerService: EmployerService
  ) {}

  onSave(data) {
    if (data.isNewEmployer) {
      this.createJobWithNewEmployer(data);
    } else {
      this.createJob(data);
    }
  }

  createJob(data) {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    this.service
      .createJob(data.job, search)
      .subscribe((job) => this.router.navigate([`/manage/jobs/${job.id}/info`]));
  }

  createJobWithNewEmployer(data) {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    this.employerService
      .createEmployer(data.employer, search)
      .switchMap((employer) => {
        data.job.store_id = employer.id;

        return this.service.createJob(data.job, search);
      })
      .subscribe((job) => this.router.navigate([`/manage/jobs/${job.id}/info`]));
  }

  isStoreRequired(value) {
    const store_id = this.form.controls['store_id'].value;
    this.form.setControl('store_id', new FormControl(store_id, value ? Validators.required : null));
  }

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: `jobs_create_job`,
        subheading: null,
        em: null,
        children: []
      }
    });
  }

  buildForm() {
    this.form = this.fb.group({
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
      is_oncampus: [JobsTypeDesireStudy.disabled]
    });
  }

  ngOnInit() {
    this.buildForm();
    this.buildHeader();
  }
}
