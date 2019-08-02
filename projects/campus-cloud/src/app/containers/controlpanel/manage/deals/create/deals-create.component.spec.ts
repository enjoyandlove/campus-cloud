import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';

import { DealsModule } from '../deals.module';
import { DealsService } from '../deals.service';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { DealsStoreService } from '../stores/store.service';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { DealsCreateComponent } from './deals-create.component';
import { baseReducers } from '@campus-cloud/store/base/reducers';

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DealsModule,
        CPTestModule,
        HttpClientModule,
        RouterTestingModule,
        StoreModule.forRoot({
          HEADER: baseReducers.HEADER,
          SNACKBAR: baseReducers.SNACKBAR
        })
      ],
      providers: [
        { provide: DealsStoreService, useClass: MockStoreService },
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
  }));

  it('createDeal', fakeAsync(() => {
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
  }));

  it('createDealWithNewStore', fakeAsync(() => {
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
  }));
});
