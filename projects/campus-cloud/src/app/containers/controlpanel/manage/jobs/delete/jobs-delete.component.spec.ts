import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpParams } from '@angular/common/http';
import { of as observableOf } from 'rxjs';

import { JobsModule } from '../jobs.module';
import { JobsService } from '../jobs.service';
import { CPSession } from '../../../../../session';
import { JobsDeleteComponent } from './jobs-delete.component';
import { mockSchool } from '../../../../../session/mock/school';
import { CPI18nService, CPTrackingService } from '../../../../../shared/services';

const mockJobs = require('../mockJobs.json');

class MockJobsService {
  dummy;

  deleteJob(id: number, search: any) {
    this.dummy = [id, search];

    return observableOf({});
  }
}

describe('JobsDeleteComponent', () => {
  let spy;
  let search;
  let component: JobsDeleteComponent;
  let fixture: ComponentFixture<JobsDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [JobsModule, RouterTestingModule],
      providers: [
        CPSession,
        CPI18nService,
        CPTrackingService,
        { provide: JobsService, useClass: MockJobsService }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(JobsDeleteComponent);
        component = fixture.componentInstance;

        component.job = mockJobs[0];

        component.session.g.set('school', mockSchool);
        search = new HttpParams().append(
          'school_id',
          component.session.g.get('school').id.toString()
        );
      });
  }));

  it('buttonData should have "Delete" label & "Danger class"', () => {
    component.ngOnInit();
    expect(component.buttonData.text).toEqual('Delete');
    expect(component.buttonData.class).toEqual('danger');
  });

  it('should delete job', () => {
    spyOn(component.deleted, 'emit');
    spyOn(component.resetDeleteModal, 'emit');
    spy = spyOn(component.service, 'deleteJob').and.returnValue(observableOf({}));

    component.onDelete();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(component.job.id, search);

    expect(component.deleted.emit).toHaveBeenCalledTimes(1);
    expect(component.deleted.emit).toHaveBeenCalledWith(component.job.id);

    expect(component.resetDeleteModal.emit).toHaveBeenCalled();
    expect(component.resetDeleteModal.emit).toHaveBeenCalledTimes(1);
  });
});
