import { async, fakeAsync, tick, TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
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
          { provide: DealsService, useClass: MockDealsService },
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(DealsListComponent);
          component = fixture.componentInstance;
          component.session.g.set('school', mockSchool);
          spyOn(component, 'buildHeader');

          search = new URLSearchParams();
          search.append('store_id', 1);
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

  it('doSort', () => {
    component.doSort('name');
    expect(component.state.sort_field).toEqual('name');
  });

  it('doFilter', () => {
    component.doSort(50);
    expect(component.state.store_id).toEqual(50);
  });

  it('onDeleted', () => {
    component.onDeleted(1);
    expect(component.deleteDeal).toBeNull();
    expect(component.state.deals).toEqual([]);
  });

  it('should fetch list of deals', fakeAsync(() => {
    spy = spyOn(component.service, 'getDeals').and.returnValue(Observable.of({}));
    component.ngOnInit();

    tick();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.state.deals.length).toEqual(mockJobs.length);
    expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
  }));

});
