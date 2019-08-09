import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';

import { DealsModule } from '../../deals.module';
import { RootStoreModule } from '@campus-cloud/store';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { StoreCardComponent } from './store-card.component';

describe('StoreCardComponent', () => {
  let component: StoreCardComponent;
  let fixture: ComponentFixture<StoreCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule, DealsModule, HttpClientModule, RouterTestingModule, RootStoreModule]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(StoreCardComponent);
        component = fixture.componentInstance;

        const fb = new FormBuilder();

        component.form = fb.group({
          store_id: [null]
        });

        component.storeForm = fb.group({
          name: [null],
          logo_url: [null]
        });
      });
  }));

  it('onTabClick - existing store', () => {
    const id = 'existing';
    spyOn(component.isNewStore, 'emit');
    component.onTabClick({ id });

    const store_id = component.form.controls['store_id'];
    const name = component.storeForm.controls['name'];
    const logo = component.storeForm.controls['logo_url'];

    expect(name.valid).toBeTruthy();
    expect(logo.valid).toBeTruthy();
    expect(store_id.valid).toBeFalsy();
    expect(component.isNewStore.emit).toHaveBeenCalledTimes(1);
    expect(component.isNewStore.emit).toHaveBeenCalledWith(false);
  });

  it('onTabClick - new store', () => {
    const id = 'new';
    spyOn(component.isNewStore, 'emit');
    component.onTabClick({ id });

    const store_id = component.form.controls['store_id'];
    const name = component.storeForm.controls['name'];
    const logo = component.storeForm.controls['logo_url'];

    expect(name.valid).toBeFalsy();
    expect(logo.valid).toBeFalsy();
    expect(store_id.valid).toBeTruthy();
    expect(component.isNewStore.emit).toHaveBeenCalledTimes(1);
    expect(component.isNewStore.emit).toHaveBeenCalledWith(true);
  });

  it('toggle isStoreRequired', () => {
    let store;

    component.isStoreRequired(false);
    store = component.form.controls['store_id'];

    expect(store.valid).toBeTruthy();

    component.isStoreRequired(true);
    component.form.controls['store_id'].setValue(null);
    store = component.form.controls['store_id'];

    expect(store.valid).toBeFalsy();
  });

  it('toggle setRequiredField', () => {
    let name;
    let logo;

    component.setRequiredField(false);
    name = component.storeForm.controls['name'];
    logo = component.storeForm.controls['logo_url'];

    expect(name.valid).toBeTruthy();
    expect(logo.valid).toBeTruthy();

    component.setRequiredField(true);
    component.form.controls['store_id'].setValue(null);
    name = component.storeForm.controls['name'];
    logo = component.storeForm.controls['logo_url'];

    expect(name.valid).toBeFalsy();
    expect(logo.valid).toBeFalsy();
  });
});
