import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpParams } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';

import { ManageHeaderService } from '../../utils';
import { CPSession } from '../../../../../session';
import { OrientationModule } from '../orientation.module';
import { OrientationListComponent } from './list.component';
import { OrientationService } from '../orientation.services';
import { mockSchool } from '../../../../../session/mock/school';
import { baseReducers } from '../../../../../store/base/reducers';
import { CPI18nService, CPTrackingService } from '../../../../../shared/services';

class MockOrientationService {
  dummy;

  getPrograms(startRage: number, endRage: number, search: any) {
    this.dummy = [startRage, endRage, search];

    return observableOf({});
  }
}

describe('OrientationListComponent', () => {
  let spy;
  let search;
  let component: OrientationListComponent;
  let fixture: ComponentFixture<OrientationListComponent>;

  const mockPrograms = require('../mock.json');

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          OrientationModule,
          RouterTestingModule,
          StoreModule.forRoot({
            HEADER: baseReducers.HEADER,
            SNACKBAR: baseReducers.SNACKBAR
          })
        ],
        providers: [
          CPSession,
          CPI18nService,
          CPTrackingService,
          ManageHeaderService,
          { provide: OrientationService, useClass: MockOrientationService }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(OrientationListComponent);

          component = fixture.componentInstance;
          component.session.g.set('school', mockSchool);

          search = new HttpParams()
            .append('search_str', component.state.search_str)
            .append('sort_field', component.state.sort_field)
            .append('sort_direction', component.state.sort_direction)
            .append('school_id', component.session.g.get('school').id.toString());
        });
    })
  );

  it('should search string', () => {
    component.onSearch('hello world');
    expect(component.state.search_str).toEqual('hello world');
  });

  it(
    'should fetch list of orientation programs',
    fakeAsync(() => {
      spy = spyOn(component.service, 'getPrograms').and.returnValue(observableOf(mockPrograms));
      component.ngOnInit();

      tick();
      expect(spy.calls.count()).toBe(1);
      expect(component.state.orientationPrograms.length).toEqual(mockPrograms.length);
      expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
    })
  );
});
