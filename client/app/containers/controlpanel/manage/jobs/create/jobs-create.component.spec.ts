import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';

import { JobsModule } from '../jobs.module';
import { JobsService } from '../jobs.service';
import { CPSession } from '../../../../../session';
import { JobsCreateComponent } from './jobs-create.component';
import { CPI18nService } from '../../../../../shared/services';
import { mockSchool } from '../../../../../session/mock/school';
import { EmployerService } from '../employers/employer.service';
import { baseReducers } from '../../../../../store/base/reducers';

const mockJobs = require('../mockJobs.json');
const mockEmployers = require('../employers/mockEmployer.json');

class MockJobsService {
  dummy;

  createJob(body: any, search: any) {
    this.dummy = [body, search];

    return observableOf(mockJobs[0]);
  }
}

class MockEmployerService {
  dummy;

  createEmployer(body: any, search: any) {
    this.dummy = [body, search];

    return observableOf({});
  }
}

describe('JobsCreateComponent', () => {
  let jobSpy;
  let spyEmployer;
  let component: JobsCreateComponent;
  let fixture: ComponentFixture<JobsCreateComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          JobsModule,
          HttpClientModule,
          RouterTestingModule,
          StoreModule.forRoot({
            HEADER: baseReducers.HEADER,
            SNACKBAR: baseReducers.SNACKBAR
          })
        ],
        providers: [
          CPSession,
          CPI18nService,
          { provide: EmployerService, useClass: MockEmployerService },
          { provide: JobsService, useClass: MockJobsService }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(JobsCreateComponent);
          component = fixture.componentInstance;

          component.buildForm();
          component.buildEmployerForm();
          component.session.g.set('school', mockSchool);

          spyOn(component.router, 'navigate');

          jobSpy = spyOn(component.service, 'createJob').and.returnValue(observableOf(mockJobs[0]));

          spyEmployer = spyOn(component.employerService, 'createEmployer').and.returnValue(
            observableOf(mockEmployers[0])
          );
        });
    })
  );

  it(
    'validation fail - posting end date should be > posting start date',
    fakeAsync(() => {
      const dateError = component.cpI18n.translate('jobs_error_end_date_before_start');
      component.ngOnInit();
      tick();

      component.data = {
        job: component.form.value,
        employer: component.employerForm.value
      };

      component.data.job.posting_start = 1525433757;
      component.data.job.posting_end = 1493897756;
      component.onSubmit();

      expect(component.formError).toBeTruthy();
      expect(component.dateErrorMessage).toEqual(dateError);
    })
  );

  it(
    'validation fail - posting end date should be > posting start date',
    fakeAsync(() => {
      const dateError = component.cpI18n.translate('jobs_error_end_date_before_start');
      component.ngOnInit();
      tick();

      component.data = {
        job: component.form.value,
        employer: component.employerForm.value
      };

      component.data.job.posting_start = 1525433757;
      component.data.job.posting_end = 1493897756;
      component.onSubmit();

      expect(component.formError).toBeTruthy();
      expect(component.dateErrorMessage).toEqual(dateError);
    })
  );

  it(
    'validation fail - posting end date should be in future',
    fakeAsync(() => {
      const dateError = component.cpI18n.translate('jobs_error_end_date_after_now');

      component.ngOnInit();
      tick();

      component.data = {
        job: component.form.value,
        employer: component.employerForm.value
      };

      component.data.job.posting_start = 1525174556;
      component.data.job.posting_end = 1525347356;
      component.onSubmit();

      expect(component.formError).toBeTruthy();
      expect(component.dateErrorMessage).toEqual(dateError);
    })
  );

  it(
    'createJob',
    fakeAsync(() => {
      component.ngOnInit();
      tick();

      component.isNewEmployer = false;
      component.data = {
        job: component.form.value,
        employer: null
      };

      component.data.job.posting_start = 1525783196;
      component.data.job.posting_end = 1588941596;
      component.onSubmit();

      expect(jobSpy).toHaveBeenCalled();
      expect(jobSpy).toHaveBeenCalledTimes(1);
    })
  );

  it(
    'createJobWithNewEmployer',
    fakeAsync(() => {
      component.ngOnInit();
      tick();

      component.isNewEmployer = true;
      component.data = {
        job: component.form.value,
        employer: component.employerForm.value
      };

      component.data.job.posting_start = 1525783196;
      component.data.job.posting_end = 1588941596;
      component.onSubmit();

      expect(jobSpy).toHaveBeenCalled();
      expect(jobSpy).toHaveBeenCalledTimes(1);

      expect(spyEmployer).toHaveBeenCalled();
      expect(spyEmployer).toHaveBeenCalledTimes(1);
    })
  );
});
