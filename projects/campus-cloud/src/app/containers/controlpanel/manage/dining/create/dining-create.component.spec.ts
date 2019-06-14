import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';
import { fillForm } from '@campus-cloud/shared/utils/tests/form';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { DiningCreateComponent } from './dining-create.component';
import {
  emptyForm,
  filledForm,
  mockLinksData,
  mockScheduleData
} from '@campus-cloud/libs/locations/common/tests';

describe('DiningCreateComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, HttpClientModule, RouterTestingModule, StoreModule.forRoot({})],
        providers: [CPSession, CPI18nService],
        declarations: [DiningCreateComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let fixture: ComponentFixture<DiningCreateComponent>;
  let component: DiningCreateComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiningCreateComponent);
    component = fixture.componentInstance;
    component.session.g.set('school', mockSchool);

    fixture.detectChanges();

    component.diningForm.get('latitude').clearAsyncValidators();
    component.diningForm.get('longitude').clearAsyncValidators();
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should create an empty form', () => {
    const result = component.diningForm.value;

    const expected = {
      ...emptyForm,
      links: mockLinksData,
      schedule: mockScheduleData(),
      latitude: mockSchool.latitude,
      longitude: mockSchool.longitude
    };

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

  it('should dispatch PostDining action', () => {
    const dispatchSpy = spyOn(component.store, 'dispatch');

    fillForm(component.diningForm, filledForm);

    component.diningForm.get('category_id').setValue(1);
    component.diningForm.get('name').setValue('Hello World!');

    component.doSubmit();

    const expected = new fromStore.PostDining(component.diningForm.value);

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0] as any;
    const { body } = payload;

    expect(body).toEqual(expected.payload);
    expect(type).toEqual(fromStore.diningActions.POST_DINING);
  });
});
