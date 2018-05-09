import { async, fakeAsync, tick, TestBed, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Store, StoreModule } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';

import { ManageHeaderService } from '../../utils';
import { CPSession } from '../../../../../session';
import { OrientationModule } from '../orientation.module';
import { OrientationListComponent } from './list.component';
import { OrientationService } from '../orientation.services';
import { CPI18nService } from '../../../../../shared/services';
import { mockSchool } from '../../../../../session/mock/school';
import { headerReducer, snackBarReducer } from '../../../../../reducers';

class MockOrientationService {
  dummy;

  getPrograms(startRage: number, endRage: number, search: any) {
    this.dummy = [startRage, endRage, search];

    return Observable.of(Observable.of({}));
  }
}

describe('OrientationListComponent', () => {
  let spy;
  let search;
  let storeSpy;
  let store: Store<any>;
  let service: OrientationService;
  let component: OrientationListComponent;
  let fixture: ComponentFixture<OrientationListComponent>;

  const mockPrograms = require('../mock.json');

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          OrientationModule,
          StoreModule.forRoot({
            HEADER: headerReducer,
            SNACKBAR: snackBarReducer
          })
        ],
        providers: [
          CPSession,
          CPI18nService,
          ManageHeaderService,
          { provide: OrientationService, useClass: MockOrientationService }
        ]
      })
        .compileComponents()
        .then(() => {
          store = TestBed.get(Store);
          storeSpy = spyOn(store, 'dispatch').and.callThrough();
          fixture = TestBed.createComponent(OrientationListComponent);
          service = TestBed.get(OrientationService);

          component = fixture.componentInstance;
          component.session.g.set('school', mockSchool);

          search = new URLSearchParams();
          search.append('search_str', component.state.search_str);
          search.append('sort_field', component.state.sort_field);
          search.append('sort_direction', component.state.sort_direction);
          search.append('school_id', component.session.g.get('school').id.toString());
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
      spy = spyOn(component.service, 'getPrograms').and.returnValue(Observable.of(mockPrograms));
      component.ngOnInit();

      tick();
      expect(spy.calls.count()).toBe(1);
      expect(component.state.orientationPrograms.length).toEqual(mockPrograms.length);
      expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
    })
  );
});
