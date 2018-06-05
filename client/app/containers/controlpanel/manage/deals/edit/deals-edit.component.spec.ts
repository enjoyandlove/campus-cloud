import { async, TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpParams, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { StoreModule } from '@ngrx/store';

import { DealsModule } from '../deals.module';
import { DealsService } from '../deals.service';
import { CPSession } from '../../../../../session';
import { StoreService } from '../stores/store.service';
import { CPI18nService } from '../../../../../shared/services';
import { mockSchool } from '../../../../../session/mock/school';
import { DealsEditComponent } from './deals-edit.component';
import { headerReducer, snackBarReducer } from '../../../../../reducers';

class MockDealsService {
  dummy;

  editDeal(body: any, search: any) {
    this.dummy = [body, search];

    return Observable.of({});
  }

  getDealById(id: number, search: any) {
    this.dummy = [id, search];

    return Observable.of({});
  }
}

class MockStoreService {
  dummy;

  createStore(body: any, search: any) {
    this.dummy = [body, search];

    return Observable.of({});
  }
}

describe('DealsEditComponent', () => {
  let spyDeal;
  let search;
  let spyStore;
  let spyFetchDeals;
  let component: DealsEditComponent;
  let fixture: ComponentFixture<DealsEditComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          DealsModule,
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
          { provide: StoreService, useClass: MockStoreService },
          { provide: DealsService, useClass: MockDealsService }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(DealsEditComponent);
          component = fixture.componentInstance;

          component.dealId = 1;
          component.session.g.set('school', mockSchool);
          search = new HttpParams().append('school_id', component.session.g.get('school').id);

          spyOn(component.router, 'navigate');

          spyDeal = spyOn(component.service, 'editDeal').and.returnValue(Observable.of({}));

          spyFetchDeals = spyOn(component.service, 'getDealById').and.returnValue(
            Observable.of({})
          );

          spyStore = spyOn(component.storeService, 'createStore').and.returnValue(
            Observable.of({})
          );
        });
    })
  );

  it('fetch deals', () => {
    component.ngOnInit();
    expect(spyFetchDeals).toHaveBeenCalledTimes(1);
    expect(spyFetchDeals).toHaveBeenCalledWith(component.dealId, search);
  });

  it(
    'editDeal',
    fakeAsync(() => {
      component.ngOnInit();
      tick();

      component.isNewStore = false;
      component.data = {
        deal: component.form.value,
        store: null
      };

      component.onSubmit();

      expect(spyDeal).toHaveBeenCalled();
      expect(spyDeal).toHaveBeenCalledTimes(1);

      expect(spyFetchDeals).toHaveBeenCalledTimes(1);
      expect(spyFetchDeals).toHaveBeenCalledWith(component.dealId, search);
    })
  );

  it(
    'editDealWithNewStore',
    fakeAsync(() => {
      component.ngOnInit();
      tick();

      component.isNewStore = true;
      component.data = {
        deal: component.form.value,
        store: component.storeForm.value
      };

      component.onSubmit();

      expect(spyDeal).toHaveBeenCalled();
      expect(spyDeal).toHaveBeenCalledTimes(1);

      expect(spyStore).toHaveBeenCalled();
      expect(spyStore).toHaveBeenCalledTimes(1);

      expect(spyFetchDeals).toHaveBeenCalledTimes(1);
      expect(spyFetchDeals).toHaveBeenCalledWith(component.dealId, search);
    })
  );
});
