import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import * as fromStore from '../store';
import { CPSession } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { mockLocations } from '@campus-cloud/libs/locations/common/tests';
import { LocationsDeleteComponent } from './locations-delete.component';

describe('LocationsDeleteComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, RouterModule.forRoot([])],
        providers: [CPSession, CPI18nService, provideMockStore()],
        declarations: [LocationsDeleteComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let fixture: ComponentFixture<LocationsDeleteComponent>;
  let component: LocationsDeleteComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsDeleteComponent);
    component = fixture.componentInstance;
    component.location = mockLocations[0];
  });

  it('should dispatch DeleteLocation action', () => {
    const dispatchSpy = spyOn(component.store, 'dispatch');

    component.onDelete();

    expect(component.store.dispatch).toHaveBeenCalled();

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0] as any;

    expect(payload).toBe(mockLocations[0]);
    expect(type).toBe(fromStore.locationActions.DELETE_LOCATION);
  });
});
