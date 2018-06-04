import { async, TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpParams, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { StoreModule } from '@ngrx/store';

import { JobsModule } from '../jobs.module';
import { JobsService } from '../jobs.service';
import { CPSession } from '../../../../../session';
import { JobsEditComponent } from './jobs-edit.component';
import { CPI18nService } from '../../../../../shared/services';
import { mockSchool } from '../../../../../session/mock/school';
import { EmployerService } from '../employers/employer.service';
import { headerReducer, snackBarReducer } from '../../../../../reducers';

const mockJobs = require('../mockJobs.json');
const mockEmployers = require('../employers/mockEmployer.json');

class MockJobsService {
  dummy;

  editJob(id: number, body: any, search: any) {
    this.dummy = [id, body, search];

    return Observable.of(mockJobs[0]);
  }

  getJobById(id: number, search: any) {
    this.dummy = [id, search];

    return Observable.of(mockJobs[0]);
  }
}

class MockEmployerService {
  dummy;

  createEmployer(body: any, search: any) {
    this.dummy = [body, search];

    return Observable.of(mockEmployers[0]);
  }
}

describe('JobsEditComponent', () => {
  let jobSpy;
  let search;
  let spyFetchJob;
  let spyEmployer;
  let component: JobsEditComponent;
  let fixture: ComponentFixture<JobsEditComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          JobsModule,
          HttpClientModule,
          RouterTestingModule,
          StoreModule.forRoot({
            HEADER: headerReducer,
            SNACKBAR: snackBarReducer
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
          fixture = TestBed.createComponent(JobsEditComponent);
          component = fixture.componentInstance;

          component.session.g.set('school', mockSchool);
          search = new HttpParams().append('school_id', component.session.g.get('school').id);

          component.jobId = 1;
          spyOn(component.router, 'navigate');

          jobSpy = spyOn(component.service, 'editJob').and.returnValue(Observable.of(mockJobs[0]));

          spyFetchJob = spyOn(component.service, 'getJobById').and.returnValue(
            Observable.of(mockJobs[0])
          );

          spyEmployer = spyOn(component.employerService, 'createEmployer').and.returnValue(
            Observable.of(mockEmployers[0])
          );
        });
    })
  );

  it('fetch job', () => {
    component.ngOnInit();
    expect(spyFetchJob).toHaveBeenCalledTimes(1);
    expect(spyFetchJob).toHaveBeenCalledWith(component.jobId, search);
  });

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

      expect(spyFetchJob).toHaveBeenCalledTimes(1);
      expect(spyFetchJob).toHaveBeenCalledWith(component.jobId, search);
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
    'editJob',
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

      expect(spyFetchJob).toHaveBeenCalledTimes(1);
      expect(spyFetchJob).toHaveBeenCalledWith(component.jobId, search);
    })
  );

  it(
    'editJobWithNewEmployer',
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

      expect(spyFetchJob).toHaveBeenCalledTimes(1);
      expect(spyFetchJob).toHaveBeenCalledWith(component.jobId, search);
    })
  );
});
