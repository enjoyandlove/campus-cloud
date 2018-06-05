import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';
import { DealsCreateComponent } from './deals-create.component';
import { headerReducer, snackBarReducer } from '../../../../../reducers';
import { CPSession } from '../../../../../session';
import { mockSchool } from '../../../../../session/mock/school';
import { CPI18nService } from '../../../../../shared/services';
import { DealsModule } from '../deals.module';
import { DealsService } from '../deals.service';
import { StoreService } from '../stores/store.service';

class MockDealsService {
  dummy;

  createDeal(body: any, search: any) {
    this.dummy = [body, search];

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

describe('DealsCreateComponent', () => {
  let spyDeal;
  let spyStore;
  let component: DealsCreateComponent;
  let fixture: ComponentFixture<DealsCreateComponent>;

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
          fixture = TestBed.createComponent(DealsCreateComponent);
          component = fixture.componentInstance;

          component.session.g.set('school', mockSchool);

          component.buildDealsForm();
          component.buildStoreForm();
          spyOn(component.router, 'navigate');

          spyDeal = spyOn(component.service, 'createDeal').and.returnValue(observableOf({}));

          spyStore = spyOn(component.storeService, 'createStore').and.returnValue(observableOf({}));
        });
    })
  );

  it(
    'createDeal',
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
    })
  );

  it(
    'createDealWithNewStore',
    fakeAsync(() => {
      component.ngOnInit();
      tick();

      component.isNewStore = true;
      component.data = {
        deal: component.form.value,
        store: component.storeForm.value
      };

      component.onSubmit();

      expect(spyStore).toHaveBeenCalled();
      expect(spyStore).toHaveBeenCalledTimes(1);

      expect(spyDeal).toHaveBeenCalled();
      expect(spyDeal).toHaveBeenCalledTimes(1);
    })
  );
});
