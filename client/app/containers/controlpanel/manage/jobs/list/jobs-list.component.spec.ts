import { HttpClientModule, HttpParams } from '@angular/common/http';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { JobsListComponent } from './jobs-list.component';
import { headerReducer, snackBarReducer } from '../../../../../reducers';
import { CPSession } from '../../../../../session';
import { mockSchool } from '../../../../../session/mock/school';
import { ManageHeaderService } from '../../utils';
import { JobsModule } from '../jobs.module';
import { JobsService } from '../jobs.service';

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
          ManageHeaderService,
          { provide: JobsService, useClass: MockJobsService }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(JobsListComponent);
          component = fixture.componentInstance;
          component.session.g.set('school', mockSchool);
          spyOn(component, 'buildHeader');

          search = new HttpParams()
            .append('store_id', null)
            .append('search_str', component.state.search_str)
            .append('sort_field', component.state.sort_field)
            .append('sort_direction', component.state.sort_direction)
            .append('school_id', component.session.g.get('school').id.toString());
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

  it(
    'should fetch list of jobs',
    fakeAsync(() => {
      spy = spyOn(component.service, 'getJobs').and.returnValue(observableOf(mockJobs));
      component.ngOnInit();

      tick();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(component.state.jobs.length).toEqual(mockJobs.length);

      expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
    })
  );
});
