import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { of } from 'rxjs';
import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { CPI18nService } from '@shared/services';
import { fillForm, mockLocations } from '../tests';
import { SharedModule } from '@shared/shared.module';
import { mockSchool } from '@app/session/mock/school';
import { configureTestSuite } from '@app/shared/tests';
import { LocationsUpdateComponent } from './locations-update.component';

describe('LocationsUpdateComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, HttpClientModule, RouterTestingModule, StoreModule.forRoot({})],
        providers: [CPSession, CPI18nService],
        declarations: [LocationsUpdateComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let fixture: ComponentFixture<LocationsUpdateComponent>;
  let component: LocationsUpdateComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsUpdateComponent);
    component = fixture.componentInstance;
    component.session.g.set('school', mockSchool);
    spyOn(component.store, 'select').and.returnValue(of(mockLocations));
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should populate form with values', () => {
    component.ngOnInit();

    fillForm(component.location.form);

    const result = component.location.form.value;
    result['id'] = 123;
    expect(result).toEqual(mockLocations[0]);
  });

  it('should show form errors true', () => {
    component.ngOnInit();

    fillForm(component.location.form);

    component.location.form.get('category_id').setValue(null);
    component.location.form.get('name').setValue(null);

    component.doSubmit();

    expect(component.formErrors).toBe(true);
  });

  it('should dispatch EditLocation action', () => {
    component.ngOnInit();
    const dispatchSpy = spyOn(component.store, 'dispatch');

    fillForm(component.location.form);

    component.doSubmit();

    const expected = new fromStore.EditLocation(component.location.form.value);

    expect(component.store.dispatch).toHaveBeenCalled();

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0];
    const { body } = payload;

    expect(body).toEqual(expected.payload);
    expect(type).toEqual(fromStore.locationActions.EDIT_LOCATION);
  });
});
