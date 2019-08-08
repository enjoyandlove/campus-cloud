import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';

import { JobsModule } from '../jobs.module';
import { JobsService } from '../jobs.service';
import { ManageHeaderService } from '../../utils';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { JobsListComponent } from './jobs-list.component';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { baseReducers } from '@campus-cloud/store/base/reducers';

const mockJobs = require('../mockJobs.json');

class MockJobsService {
  dummy;

  getJobs(startRage: number, endRage: number, search: any) {
    this.dummy = [startRage, endRage, search];

    return observableOf(mockJobs);
  }
}

describe('JobsListComponent', () => {
  let spy;
  let search;
  let component: JobsListComponent;
  let fixture: ComponentFixture<JobsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CPTestModule,
        JobsModule,
        HttpClientModule,
        RouterTestingModule,
        StoreModule.forRoot({
          HEADER: baseReducers.HEADER,
          SNACKBAR: baseReducers.SNACKBAR
        })
      ],
      providers: [ManageHeaderService, { provide: JobsService, useClass: MockJobsService }]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(JobsListComponent);
        component = fixture.componentInstance;
        component.session.g.set('school', mockSchool);
        spyOn(component.headerService, 'updateHeader');

        search = new HttpParams()
          .append('store_id', null)
          .append('search_str', component.state.search_str)
          .append('sort_field', component.state.sort_field)
          .append('sort_direction', component.state.sort_direction)
          .append('school_id', component.session.g.get('school').id.toString());
      });
  }));

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('onSearch', () => {
    component.onSearch('hello world');
    expect(component.state.search_str).toEqual('hello world');
  });

  it('onDeleted', () => {
    component.onDeleted(1);
    expect(component.deleteJob).toBeNull();
    expect(component.state.jobs).toEqual([]);
  });

  it('should fetch list of jobs', fakeAsync(() => {
    spy = spyOn(component.service, 'getJobs').and.returnValue(observableOf(mockJobs));
    component.ngOnInit();

    tick();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.state.jobs.length).toEqual(mockJobs.length);

    expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
  }));
});
