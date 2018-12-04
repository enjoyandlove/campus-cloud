import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { fillForm, mockLocations } from '../tests';
import { CPI18nService } from '@shared/services';
import { SharedModule } from '@shared/shared.module';
import { mockSchool } from '@app/session/mock/school';
import { configureTestSuite } from '@app/shared/tests';
import { LocationsUpdateComponent } from './locations-update.component';
import { of } from 'rxjs/index';

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

    fillForm(component.form);

    const result = component.form.value;
    result['id'] = 123;
    expect(result).toEqual(mockLocations);
  });

  it('should dispatch EditLocation action', () => {
    component.ngOnInit();
    const dispatchSpy = spyOn(component.store, 'dispatch');

    fillForm(component.form);

    component.doSubmit();

    const expected = new fromStore.EditLocation(component.form.value);

    expect(component.store.dispatch).toHaveBeenCalled();

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0];
    const { body } = payload;

    expect(body).toEqual(expected.payload);
    expect(type).toEqual(fromStore.locationActions.EDIT_LOCATION);
  });
});
