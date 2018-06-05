import { HttpParams } from '@angular/common/http';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';
import { StoreListComponent } from './store-list.component';
import { headerReducer, snackBarReducer } from '../../../../../../reducers';
import { CPSession } from '../../../../../../session';
import { mockSchool } from '../../../../../../session/mock/school';
import { StoreModule as DealsStoreModule } from '../store.module';
import { StoreService } from '../store.service';

class MockStoreService {
  dummy;

  getStores(startRage: number, endRage: number, search: any) {
    this.dummy = [startRage, endRage, search];

    return observableOf({});
  }
}

describe('DealsStoreListComponent', () => {
  let spy;
  let search;
  let component: StoreListComponent;
  let fixture: ComponentFixture<StoreListComponent>;

  const mockStores = require('../mockStores.json');

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          DealsStoreModule,
          RouterTestingModule,
          StoreModule.forRoot({
            HEADER: headerReducer,
            SNACKBAR: snackBarReducer
          })
        ],
        providers: [CPSession, CPI18nService, { provide: StoreService, useClass: MockStoreService }]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(StoreListComponent);
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

  it('onSearch', () => {
    component.onSearch('hello world');
    expect(component.state.search_str).toEqual('hello world');
  });

  it('doSort', () => {
    component.doSort('name');
    expect(component.state.sort_field).toEqual('name');
  });

  it('onCreated', () => {
    component.onCreated(mockStores[0]);

    expect(component.launchCreateModal).toBeFalsy();
    expect(component.state.stores).toEqual([mockStores[0]]);
  });

  it('onEdited', () => {
    component.onEdited(mockStores[0]);

    expect(component.launchEditModal).toBeFalsy();
    expect(component.selectedStore).toBeNull();
    expect(component.state.stores).toEqual([mockStores[0]]);
  });

  it('onDeleted', () => {
    component.onDeleted(1);
    expect(component.deleteStore).toBeNull();
    expect(component.state.stores).toEqual([]);
  });

  it('should launch create modal', () => {
    expect(component.launchCreateModal).toBeFalsy();
    component.onLaunchCreateModal();
    expect(component.launchCreateModal).toBeTruthy();
  });

  it(
    'should fetch list of stores',
    fakeAsync(() => {
      spy = spyOn(component.service, 'getStores').and.returnValue(observableOf(mockStores));
      component.ngOnInit();

      tick();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(component.state.stores.length).toEqual(mockStores.length);
      expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
    })
  );
});
