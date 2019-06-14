import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule as NgrxStore } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Actions } from '@ngrx/effects';

import { CPSession } from '@app/session';
import { StoreModule } from '../store.module';
import { configureTestSuite } from '@shared/tests';
import * as fromDeals from '@app/store/manage/deals';
import { mockSchool } from '@app/session/mock/school';
import { StoreEditComponent } from './store-edit.component';
import { CPI18nService } from '@shared/services/i18n.service';
import { StoreFormComponent } from '../components/store-form';

describe('DealsStoreEditComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule, StoreModule, RouterTestingModule, NgrxStore.forRoot({})],
        providers: [Store, Actions, CPSession, FormBuilder, CPI18nService]
      });
      TestBed.overrideComponent(StoreFormComponent, {
        set: { template: '<p>Mock Store Form Component</p>' }
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let spy;
  let component: StoreEditComponent;
  let fixture: ComponentFixture<StoreEditComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StoreEditComponent);
    component = fixture.componentInstance;

    component.session.g.set('school', mockSchool);

    component.store = {
      id: 1,
      city: 'Karachi',
      province: 'Sindh',
      country: 'Pakistan',
      postal_code: '',
      address: 'Clifton',
      latitude: '',
      longitude: '',
      website: 'www.oohlalamobile.com',
      name: 'Hello World!',
      description: 'This is description',
      logo_url: 'dummy.jpeg'
    };

    fixture.detectChanges();
  }));

  it('form validation - should fail', () => {
    component.storeForm.controls['name'].setValue(null);
    expect(component.storeForm.valid).toBeFalsy();
  });

  it('form validation - should pass', () => {
    expect(component.storeForm.valid).toBeTruthy();
  });

  it('form validation - max length 120 - should fail', () => {
    const charCount121 = 'a'.repeat(121);

    component.storeForm.controls['name'].setValue(charCount121);
    expect(component.storeForm.valid).toBeFalsy();
  });

  it('save button should be disabled', () => {
    component.storeForm.controls['name'].setValue(null);
    expect(component.buttonData.disabled).toBeTruthy();
  });

  it('save button should be enabled', () => {
    expect(component.buttonData.disabled).toBeFalsy();
  });

  it('should dispatch edit action', () => {
    spy = spyOn(component.stateStore, 'dispatch');
    component.onSubmit();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(new fromDeals.EditStore(component.storeForm.value));
  });

  it('should emit after edit', async(() => {
    spyOn(component.edited, 'emit');
    spyOn(component, 'resetModal');

    component.stateStore.dispatch(new fromDeals.EditStoreSuccess(component.store));
    fixture.detectChanges();

    expect(component.edited.emit).toHaveBeenCalledTimes(1);
    expect(component.edited.emit).toHaveBeenCalledWith(component.store);
    expect(component.resetModal).toHaveBeenCalledTimes(1);
  }));
});
