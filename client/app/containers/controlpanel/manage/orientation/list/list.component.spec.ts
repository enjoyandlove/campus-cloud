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
  let arr;
  let fakeRequest;
  let compSpy;
  let storeSpy;
  let resPrograms;
  let mockPrograms;
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
    mockPrograms = require('../mock.json');
    resPrograms = service.getOrientationPrograms(0, 0, null);

    expect(compSpy).not.toHaveBeenCalled();
    component.fetch();
    expect(compSpy).toHaveBeenCalled();

    expect(resPrograms.value.length).toEqual(mockPrograms.length);
    expect(resPrograms).toEqual(Observable.of(mockPrograms));
  });

  it('should search string', () => {
    component.onSearch('hello world');
    expect(component.state.search_str).toEqual('hello world');
  });

  it('should show pagination', () => {
    arr = [];
    for (let i = 1; i <= 200; i++) {
      arr.push(i);
    }

    fakeRequest = Observable.of(arr);

    component.fetchData(fakeRequest)
      .then((res) => {
        expect(component.pageNext).toBeTruthy();
        expect(component.pagePrev).toBeFalsy();
        expect(res.data.length).toBe(199);
      });
  });

  it('onPaginationNext', () => {
    component.onPaginationNext();
    expect(component.pageNumber).toEqual(2);
    expect(component.startRange).toEqual(101);
    expect(component.endRange).toEqual(201);
  });

  it('onPaginationPrevious', () => {
    component.pageNumber = 2;
    component.startRange = 101;
    component.endRange = 201;

    component.onPaginationPrevious();

    expect(component.pageNumber).toEqual(1);
    expect(component.startRange).toEqual(1);
    expect(component.endRange).toEqual(101);
  });

});
