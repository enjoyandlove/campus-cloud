import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { JobsModule } from '../jobs.module';
import { JobsService } from '../jobs.service';
import { CPSession } from '../../../../../session';
import { JobsDeleteComponent } from './jobs-delete.component';
import { CPI18nService } from '../../../../../shared/services';
import { mockSchool } from '../../../../../session/mock/school';

const mockJobs = require('../mockJobs.json');

class MockJobsService {
  dummy;

  deleteJob(id: number, search: any) {
    this.dummy = [id, search];

    return Observable.of({});
  }
}

describe('JobsDeleteComponent', () => {
  let spy;
  let search;
  let component: JobsDeleteComponent;
  let fixture: ComponentFixture<JobsDeleteComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [JobsModule],
        providers: [
          CPSession,
          CPI18nService,
          { provide: JobsService, useClass: MockJobsService },
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(JobsDeleteComponent);
          component = fixture.componentInstance;

          search = new URLSearchParams();
          component.job = mockJobs[0];

          component.session.g.set('school', mockSchool);
          search.append('school_id', component.session.g.get('school').id.toString());
        });
    })
  );

  it('buttonData should have "Delete" label & "Danger class"', () => {
    component.ngOnInit();
    expect(component.buttonData.text).toEqual('Delete');
    expect(component.buttonData.class).toEqual('danger');
  });

  it('should delete job', () => {
    spyOn(component.deleted, 'emit');
    spyOn(component.resetDeleteModal, 'emit');
    spy = spyOn(component.service, 'deleteJob').and.returnValue(Observable.of({}));

    component.onDelete();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(component.job.id, search);

    expect(component.deleted.emit).toHaveBeenCalledTimes(1);
    expect(component.deleted.emit).toHaveBeenCalledWith(component.job.id);

    expect(component.resetDeleteModal.emit).toHaveBeenCalled();
    expect(component.resetDeleteModal.emit).toHaveBeenCalledTimes(1);
  });

});
