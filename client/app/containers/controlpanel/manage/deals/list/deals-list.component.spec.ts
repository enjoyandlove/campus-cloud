import { async, fakeAsync, tick, TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';

import { DealsModule } from '../deals.module';
import { DealsService } from '../deals.service';
import { ManageHeaderService } from '../../utils';
import { CPSession } from '../../../../../session';
import { DealsListComponent } from './deals-list.component';
import { mockSchool } from '../../../../../session/mock/school';
import { headerReducer, snackBarReducer } from '../../../../../reducers';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

class MockDealsService {
  dummy;

  getDeals(startRage: number, endRage: number, search: any) {
    this.dummy = [startRage, endRage, search];

    return Observable.of({});
  }
}

describe('DealsListComponent', () => {
  let spy;
  let search;
  let component: DealsListComponent;
  let fixture: ComponentFixture<DealsListComponent>;

  const mockDeals = require('../mockDeals.json');

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpModule,
          DealsModule,
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
          { provide: DealsService, useClass: MockDealsService }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(DealsListComponent);
          component = fixture.componentInstance;
          component.session.g.set('school', mockSchool);
          spyOn(component, 'buildHeader');

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

  it('doFilter', () => {
    const store_id = 50;
    component.state = { ...component.state, store_id };
    component.doSort(component.state);
    expect(component.state.store_id).toEqual(50);
  });

  it('onDeleted', () => {
    component.onDeleted(1);
    expect(component.deleteDeal).toBeNull();
    expect(component.state.deals).toEqual([]);
  });

  it(
    'should fetch list of deals',
    fakeAsync(() => {
      spy = spyOn(component.service, 'getDeals').and.returnValue(Observable.of(mockDeals));
      component.ngOnInit();

      tick();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(component.state.deals.length).toEqual(mockDeals.length);
      expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
    })
  );
});
