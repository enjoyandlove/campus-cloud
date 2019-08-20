import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { omit } from 'lodash';
import { of } from 'rxjs';

import * as fromStore from '../store';
import { fillForm } from '@campus-cloud/shared/utils/tests/form';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { LocationsEditComponent } from './locations-edit.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { mockLocations, filledForm } from '@campus-cloud/libs/locations/common/tests';

describe('LocationsEditComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, HttpClientModule, RouterTestingModule],
        providers: [provideMockStore()],
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

  it('should populate form with values', () => {
    const expected = omit(mockLocations[0], [
      'notes',
      'category_name',
      'category_color',
      'category_img_url',
      'category_is_default'
    ]);

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

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0] as any;
    const { body } = payload;

    expect(body).toEqual(expected.payload);
    expect(type).toEqual(fromStore.locationActions.EDIT_LOCATION);
  });
});
