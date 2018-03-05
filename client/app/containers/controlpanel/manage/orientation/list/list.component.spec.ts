import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CPSession } from '../../../../../session';
import { Store, StoreModule } from '@ngrx/store';
import { ManageHeaderService } from '../../utils';
import { CPI18nService } from '../../../../../shared/services';
import { OrientationService } from '../orientation.services';
import { OrientationListComponent } from './list.component';
import { headerReducer, snackBarReducer } from '../../../../../reducers';
import { Observable } from 'rxjs/Observable';

class MockOrientationService {
  dummy;
  mockPrograms = require('../mock.json');

  getOrientationPrograms(startRage: number, endRage: number, search: any) {
    this.dummy = [startRage, endRage, search];

    return Observable.of(this.mockPrograms);
  }
}

describe('OrientationListComponent', () => {
  let compSpy;
  let storeSpy;
  let store: Store<any>;
  let service: OrientationService;
  let component: OrientationListComponent;
  let fixture: ComponentFixture<OrientationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrientationListComponent,
      ],
      imports: [
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
    }).overrideComponent(OrientationListComponent, {
      set: {
        template: '<div>No Template</div>'
      }
    })
      .compileComponents()
      .then(() => {
        store = TestBed.get(Store);
        storeSpy = spyOn(store, 'dispatch').and.callThrough();
        fixture = TestBed.createComponent(OrientationListComponent);
        component = fixture.componentInstance;
        service = TestBed.get(OrientationService);
        compSpy = spyOn(component, 'fetch');
      });
  }));

  it('should fetch list of orientation programs', () => {
    expect(compSpy).not.toHaveBeenCalled();
    component.fetch();
    expect(compSpy).toHaveBeenCalled();
    expect(service.getOrientationPrograms(0, 0, null))
      .toEqual(Observable.of(require('../mock.json')));
  });
});
