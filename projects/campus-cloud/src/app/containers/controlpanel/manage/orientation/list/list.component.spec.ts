import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpParams } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { ManageHeaderService } from '../../utils';
import { OrientationModule } from '../orientation.module';
import { OrientationListComponent } from './list.component';
import { OrientationService } from '../orientation.services';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { MockOrientationService, mockPrograms } from '../tests';
import { baseReducers } from '@campus-cloud/store/base/reducers';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';

describe('OrientationListComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [
          CPTestModule,
          OrientationModule,
          RouterTestingModule,
          StoreModule.forRoot({
            HEADER: baseReducers.HEADER,
            SNACKBAR: baseReducers.SNACKBAR
          })
        ],
        providers: [
          CPTrackingService,
          ManageHeaderService,
          { provide: OrientationService, useClass: MockOrientationService }
        ]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let spy;
  let search;
  let component: OrientationListComponent;
  let fixture: ComponentFixture<OrientationListComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OrientationListComponent);

    component = fixture.componentInstance;
    component.session.g.set('school', mockSchool);

    search = new HttpParams()
      .set('search_str', component.state.search_str)
      .set('sort_field', component.state.sort_field)
      .set('sort_direction', component.state.sort_direction)
      .set('school_id', component.session.g.get('school').id.toString());
  }));

  it('should search string', () => {
    component.onSearch('hello world');
    expect(component.state.search_str).toEqual('hello world');
  });

  it('should fetch list of orientation programs', fakeAsync(() => {
    spy = spyOn(component.service, 'getPrograms').and.returnValue(of(mockPrograms));
    component.ngOnInit();

    tick();
    expect(spy.calls.count()).toBe(1);
    expect(component.state.orientationPrograms.length).toEqual(mockPrograms.length);
    expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
  }));
});
