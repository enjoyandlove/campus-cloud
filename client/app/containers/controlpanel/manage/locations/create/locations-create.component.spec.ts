import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { emptyForm, fillForm } from '../tests';
import { CPI18nService } from '@shared/services';
import { SharedModule } from '@shared/shared.module';
import { configureTestSuite } from '@app/shared/tests';
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
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should create an empty form', () => {
    component.ngOnInit();

    const result = component.form.value;
    expect(result).toEqual(emptyForm);
  });

  it('should dispatch PostLocation action', () => {
    component.ngOnInit();
    const dispatchSpy = spyOn(component.store, 'dispatch');

    fillForm(component.form);

    component.doSubmit();

    const expected = new fromStore.PostLocation(component.form.value);

    expect(component.store.dispatch).toHaveBeenCalled();

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0];
    const { body } = payload;

    expect(body).toEqual(expected.payload);
    expect(type).toEqual(fromStore.locationActions.POST_LOCATION);
  });
});
