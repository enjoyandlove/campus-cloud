import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormArray } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { omit } from 'lodash';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { CPI18nService } from '@shared/services';
import { fillForm } from '@shared/utils/tests/form';
import { SharedModule } from '@shared/shared.module';
import { mockSchool } from '@app/session/mock/school';
import { configureTestSuite } from '@app/shared/tests';
import { emptyForm, filledForm } from '@libs/locations/common/tests';
import { LocationsCreateComponent } from './locations-create.component';

describe('LocationsCreateComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, HttpClientModule, RouterTestingModule, StoreModule.forRoot({})],
        providers: [CPSession, CPI18nService],
        declarations: [LocationsCreateComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let fixture: ComponentFixture<LocationsCreateComponent>;
  let component: LocationsCreateComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsCreateComponent);
    component = fixture.componentInstance;
    component.session.g.set('school', mockSchool);

    // initial change detection, (this calls all lifecycle hooks)
    fixture.detectChanges();

    // ignore async validators
    component.locationForm.get('latitude').clearAsyncValidators();
    component.locationForm.get('longitude').clearAsyncValidators();
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should create an empty form', () => {
    const result = component.locationForm.value;

    const filteredFormFields = omit(emptyForm, ['notes']);

    // update lat/lng values being set after form is created
    const expected = {
      ...filteredFormFields,
      latitude: mockSchool.latitude,
      longitude: mockSchool.longitude
    };
    expect(result['schedule'].length).toEqual(7);

    result['links'] = [];
    result['schedule'] = [];
    expect(result).toEqual(expected);
  });

  it('should show form errors true', () => {
    fillForm(component.locationForm, filledForm);

    component.locationForm.get('category_id').setValue(null);
    component.locationForm.get('name').setValue(null);

    component.doSubmit();

    expect(component.formErrors).toBe(true);
  });

  it('should validate links label with url & vice versa', () => {
    const someValue = 'some value';

    fillForm(component.locationForm, filledForm);

    const links = <FormArray>component.locationForm.controls['links'];

    links.controls[0].get('label').setValue(null);
    links.controls[0].get('url').setValue(someValue);

    component.doSubmit();

    expect(links.controls[0].errors.labelRequired).toBe(true);

    links.controls[0].get('label').setValue(someValue);
    links.controls[0].get('url').setValue(null);

    component.doSubmit();

    expect(links.controls[0].errors.urlRequired).toBe(true);
  });

  it('should dispatch PostLocation action', () => {
    const dispatchSpy = spyOn(component.store, 'dispatch');

    fillForm(component.locationForm, filledForm);

    component.locationForm.get('category_id').setValue(1);
    component.locationForm.get('name').setValue('Hello World!');

    component.doSubmit();

    const expected = new fromStore.PostLocation(component.locationForm.value);

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0];
    const { body } = payload;

    expect(body).toEqual(expected.payload);
    expect(type).toEqual(fromStore.locationActions.POST_LOCATION);
  });
});
