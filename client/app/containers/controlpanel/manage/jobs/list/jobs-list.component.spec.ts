import { async, fakeAsync, tick, TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { StoreModule } from '@ngrx/store';

import { JobsModule } from '../jobs.module';
import { JobsService } from '../jobs.service';
import { ManageHeaderService } from '../../utils';
import { CPSession } from '../../../../../session';
import { JobsListComponent } from './jobs-list.component';
import { mockSchool } from '../../../../../session/mock/school';
import { headerReducer, snackBarReducer } from '../../../../../reducers';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

const mockJobs = require('../mockJobs.json');

class MockJobsService {
  dummy;

  getJobs(startRage: number, endRage: number, search: any) {
    this.dummy = [startRage, endRage, search];

    return Observable.of(mockJobs);
  }
}

describe('JobsListComponent', () => {
  let spy;
  let search;
  let service: JobsService;
  let component: JobsListComponent;
  let fixture: ComponentFixture<JobsListComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpModule,
          JobsModule,
          RouterTestingModule,
          StoreModule.forRoot({
            HEADER: headerReducer,
            SNACKBAR: snackBarReducer
          })
        ],
        providers: [
          CPSession,
          CPI18nService,
          ManageHeaderService,
          { provide: JobsService, useClass: MockJobsService },
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(JobsListComponent);
          component = fixture.componentInstance;
          service = TestBed.get(JobsService);
          component.session.g.set('school', mockSchool);
          spyOn(component, 'buildHeader');

          search = new URLSearchParams();
          search.append('search_str', component.state.search_str);
          search.append('sort_field', component.state.sort_field);
          search.append('sort_direction', component.state.sort_direction);
          search.append('school_id', component.session.g.get('school').id.toString());
        });
    })
  );

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
    spy = spyOn(component.service, 'getJobs').and.returnValue(Observable.of(mockJobs));
    component.ngOnInit();

    tick();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.state.jobs.length).toEqual(mockJobs.length);
    expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
  }));

});
