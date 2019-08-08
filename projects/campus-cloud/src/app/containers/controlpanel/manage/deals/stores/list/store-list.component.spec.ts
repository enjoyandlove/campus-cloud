import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpParams } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';

import { DealsStoreService } from '../store.service';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { StoreListComponent } from './store-list.component';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { baseReducers } from '@campus-cloud/store/base/reducers';
import { StoreModule as DealsStoreModule } from '../store.module';

const mockStores = require('../mockStores.json');

class MockStoreService {
  dummy;

  getStores(startRage: number, endRage: number, search: any) {
    this.dummy = [startRage, endRage, search];

    return observableOf(mockStores);
  }
}

describe('DealsStoreListComponent', () => {
  let spy;
  let search;
  let component: StoreListComponent;
  let fixture: ComponentFixture<StoreListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CPTestModule,
        DealsStoreModule,
        RouterTestingModule,
        StoreModule.forRoot({
          HEADER: baseReducers.HEADER,
          SNACKBAR: baseReducers.SNACKBAR
        })
      ],
      providers: [{ provide: DealsStoreService, useClass: MockStoreService }]
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

        component.state = {
          stores: [],
          search_str: null,
          sort_field: 'name',
          sort_direction: 'asc'
        };

        fixture.detectChanges();
      });
  }));

  it('onDeleted', () => {
    expect(component.state.stores.length).toBe(mockStores.length);

    component.onDeleted(1);

    expect(component.deleteStore).toBeNull();
    expect(component.state.stores.length).toBe(1);
  });

  it('onEdited', () => {
    const original = { ...component.state.stores[0] };
    const edited = { ...original, name: 'Edited' };

    component.onEdited(edited);

    expect(component.launchEditModal).toBeFalsy();
    expect(component.selectedStore).toBeNull();

    const result = component.state.stores.filter((s) => s.id === original.id)[0];
    expect(result).toEqual(edited);
  });

  it('doSort', () => {
    component.doSort('name');
    expect(component.state.sort_field).toEqual('name');
  });

  it('onCreated', () => {
    expect(component.state.stores.length).toBe(2);

    component.onCreated(mockStores[0]);

    expect(component.launchCreateModal).toBeFalsy();
    expect(component.state.stores.length).toBe(3);
  });

  it('should fetch list of stores', fakeAsync(() => {
    spy = spyOn(component.service, 'getStores').and.returnValue(observableOf(mockStores));
    component.ngOnInit();

    tick();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.state.stores.length).toEqual(mockStores.length);
    expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
  }));

  it('onSearch', () => {
    component.onSearch('hello world');
    expect(component.state.search_str).toEqual('hello world');
  });

  it('should launch create modal', () => {
    expect(component.launchCreateModal).toBeFalsy();
    component.onLaunchCreateModal();
    expect(component.launchCreateModal).toBeTruthy();
  });
});
