import { HttpClientModule, HttpParams } from '@angular/common/http';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';
import { DealsEditComponent } from './deals-edit.component';
import { reducers } from '../../../../../reducers';
import { CPSession } from '../../../../../session';
import { mockSchool } from '../../../../../session/mock/school';
import { CPI18nService } from '../../../../../shared/services';
import { DealsModule } from '../deals.module';
import { DealsService } from '../deals.service';
import { DealsStoreService } from '../stores/store.service';

class MockDealsService {
  dummy;

  editDeal(body: any, search: any) {
    this.dummy = [body, search];

    return observableOf({});
  }

  getDealById(id: number, search: any) {
    this.dummy = [id, search];

    return observableOf({});
  }
}

class MockStoreService {
  dummy;

  createStore(body: any, search: any) {
    this.dummy = [body, search];

    return observableOf({});
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
            HEADER: reducers.HEADER,
            SNACKBAR: reducers.SNACKBAR
          })
        ],
        providers: [
          CPSession,
          CPI18nService,
          { provide: DealsStoreService, useClass: MockStoreService },
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

          spyDeal = spyOn(component.service, 'editDeal').and.returnValue(observableOf({}));

          spyFetchDeals = spyOn(component.service, 'getDealById').and.returnValue(observableOf({}));

          spyStore = spyOn(component.storeService, 'createStore').and.returnValue(observableOf({}));
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

  it('should set ongoing true', () => {
    const data = {
      expiration: -1
    };
    component.buildDealsForm(data);
    expect(component.form.controls.ongoing.value).toBe(true);
  });

  it('should set ongoing false', () => {
    const data = {
      expiration: 1234567890
    };
    component.buildDealsForm(data);
    expect(component.form.controls.ongoing.value).toBe(false);
  });
});
