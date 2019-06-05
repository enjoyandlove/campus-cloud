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
import { SharedModule } from '@shared/shared.module';
import { mockSchool } from '@app/session/mock/school';
import { configureTestSuite } from '@app/shared/tests';
import { DiningEditComponent } from './dining-edit.component';
import {
  filledForm,
  mockLinksData,
  mockScheduleData,
  mockLocations as mockDining
} from '@libs/locations/common/tests';

describe('DiningEditComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, HttpClientModule, RouterTestingModule, StoreModule.forRoot({})],
        providers: [CPSession, CPI18nService],
        declarations: [DiningEditComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let fixture: ComponentFixture<DiningEditComponent>;
  let component: DiningEditComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiningEditComponent);
    component = fixture.componentInstance;
    component.openingHours = true;
    component.session.g.set('school', mockSchool);
    spyOn(component.store, 'select').and.returnValue(of(mockDining[0]));

    fixture.detectChanges();

    component.diningForm.get('latitude').clearAsyncValidators();
    component.diningForm.get('longitude').clearAsyncValidators();
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should populate form with values', () => {
    let expected = omit(mockDining[0], [
      'id',
      'category_name',
      'category_color',
      'category_img_url',
      'category_is_default'
    ]);

    expected = {
      ...expected,
      links: mockLinksData,
      schedule: mockScheduleData()
    };

    fillForm(component.diningForm, filledForm);

    const result = component.diningForm.value;

    expect(result['schedule'].length).toEqual(7);

    expect(result).toEqual(expected);
  });

  it('should show form errors true', () => {
    fillForm(component.diningForm, filledForm);

    component.diningForm.get('category_id').setValue(null);
    component.diningForm.get('name').setValue(null);

    component.doSubmit();

    expect(component.formErrors).toBe(true);
  });

  it('should dispatch EditDining action', () => {
    const dispatchSpy = spyOn(component.store, 'dispatch');

    fillForm(component.diningForm, filledForm);

    component.doSubmit();

    const expected = new fromStore.EditDining(component.diningForm.value);

    expect(component.store.dispatch).toHaveBeenCalled();

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0] as any;
    const { body } = payload;

    expect(body).toEqual(expected.payload);
    expect(type).toEqual(fromStore.diningActions.EDIT_DINING);
  });
});
