import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { omit } from 'lodash';

import { of } from 'rxjs';
import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { CPI18nService } from '@shared/services';
import { fillForm } from '@shared/utils/tests/form';
import { mockLocations, filledForm } from '../tests';
import { SharedModule } from '@shared/shared.module';
import { mockSchool } from '@app/session/mock/school';
import { configureTestSuite } from '@app/shared/tests';
import { LocationsEditComponent } from './locations-edit.component';

describe('LocationsEditComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, HttpClientModule, RouterTestingModule, StoreModule.forRoot({})],
        providers: [CPSession, CPI18nService],
        declarations: [LocationsEditComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let fixture: ComponentFixture<LocationsEditComponent>;
  let component: LocationsEditComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsEditComponent);
    component = fixture.componentInstance;
    component.openingHours = true;
    component.session.g.set('school', mockSchool);
    spyOn(component.store, 'select').and.returnValue(of(mockLocations[0]));

    fixture.detectChanges();

    component.locationForm.get('latitude').clearAsyncValidators();
    component.locationForm.get('longitude').clearAsyncValidators();
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should populate form with values', () => {
    const expected = omit(mockLocations[0], ['category_img_url', 'category_name']);

    fillForm(component.locationForm, filledForm);

    const result = component.locationForm.value;
    result['id'] = 123;

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

  it('should dispatch EditLocation action', () => {
    const dispatchSpy = spyOn(component.store, 'dispatch');

    fillForm(component.locationForm, filledForm);

    component.doSubmit();

    const expected = new fromStore.EditLocation(component.locationForm.value);

    expect(component.store.dispatch).toHaveBeenCalled();

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0];
    const { body } = payload;

    expect(body).toEqual(expected.payload);
    expect(type).toEqual(fromStore.locationActions.EDIT_LOCATION);
  });
});
