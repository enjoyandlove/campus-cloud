import { tick, async, fakeAsync, TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpParams, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { JobsModule } from '../jobs.module';
import { JobsService } from '../jobs.service';
import { CPSession } from '../../../../../session';
import { JobsUtilsService } from '../jobs.utils.service';
import { JobsInfoComponent } from './jobs-info.component';
import { CPI18nService } from '../../../../../shared/services';
import { mockSchool } from '../../../../../session/mock/school';
import { headerReducer, snackBarReducer } from '../../../../../reducers';

const mockJobs = require('../mockJobs.json');

class MockJobsService {
  dummy;

  getJobById(id: number, search: any) {
    this.dummy = [id, search];

    return Observable.of(mockJobs[0]);
  }
}

describe('JobsInfoComponent', () => {
  let spy;
  let search;
  let jobTypes;
  let desiredStudy;
  let component: JobsInfoComponent;
  let fixture: ComponentFixture<JobsInfoComponent>;

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
          JobsUtilsService,
          { provide: JobsService, useClass: MockJobsService }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(JobsInfoComponent);
          component = fixture.componentInstance;

          component.jobId = 1;
          component.session.g.set('school', mockSchool);
          component.isLoading().subscribe((_) => (component.loading = false));
          search = new HttpParams().append('school_id', component.session.g.get('school').id);
        });
    })
  );

  it(
    'should get job info',
    fakeAsync(() => {
      spy = spyOn(component.service, 'getJobById').and.returnValue(Observable.of(mockJobs[0]));
      const job = mockJobs[0];
      const bannerDe: DebugElement = fixture.debugElement;
      const bannerEl: HTMLElement = bannerDe.nativeElement;
      component.fetch();
      tick();

      fixture.detectChanges();
      desiredStudy = component.utils
        .getDesiredStudy(false, false, false, false, false, false, true)
        .map((study) => study.label);

      jobTypes = component.utils
        .getJobsType(false, true, false, false, false, false, false, false)
        .map((type) => type.label);

      const jobElement = bannerEl.querySelector('div.row div.job');

      const jobTitle = jobElement.querySelector('div.row .job__title');
      const jobDescription = jobElement.querySelector('div.row .job__description');
      const jobHowToApply = jobElement.querySelector('div.row .job__how-to-apply');
      const jobPostingStart = jobElement.querySelector('div.row .posting-start');
      const jobPostingEnd = jobElement.querySelector('div.row .posting-end');
      const jobStartDate = jobElement.querySelector('div.row .job-start');
      const jobEndDate = jobElement.querySelector('div.row .job-end');
      const jobLocation = jobElement.querySelector('div.row .location');
      const jobDesiredYear = jobElement.querySelector('div.row .desired-year');
      const jobType = jobElement.querySelector('div.row .job-type');

      const employerElement = bannerEl.querySelector('div.row div.employer');
      const employerImage = employerElement.querySelector('div.row .employer__image');
      const employerName = employerElement.querySelector('div.row .employer__title');
      const employerDescription = employerElement.querySelector('div.row .employer__description');

      expect(jobTitle.textContent).toEqual(job.title);
      expect(jobDescription.textContent).toContain(job.description);
      expect(jobHowToApply.textContent).toContain(job.how_to_apply);
      expect(jobPostingStart.textContent).toContain('May 12th, 2019');
      expect(jobPostingEnd.textContent).toContain('May 12th, 2019');
      expect(jobStartDate.textContent).toContain('May 12th, 2019');
      expect(jobEndDate.textContent).toContain('May 12th, 2019');
      expect(jobLocation.textContent).toContain(job.location);
      expect(jobDesiredYear.textContent).toContain(desiredStudy.join(', '));
      expect(jobType.textContent).toContain(jobTypes.join(', '));

      const img = employerImage['style'].backgroundImage.slice(4, -1).replace(/"/g, '');
      expect(img).toEqual(job.employer_logo_url);
      expect(employerName.textContent).toEqual(job.employer_name);
      expect(employerDescription.textContent).toContain(job.employer_description);
    })
  );
});
