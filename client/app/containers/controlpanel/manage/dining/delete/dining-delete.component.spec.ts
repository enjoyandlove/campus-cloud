import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { CPI18nService } from '@shared/services';
import { SharedModule } from '@shared/shared.module';
import { mockSchool } from '@app/session/mock/school';
import { configureTestSuite } from '@app/shared/tests';
import { DiningDeleteComponent } from './dining-delete.component';
import { mockLocations as mockDining } from '@libs/locations/common/tests';

describe('DiningDeleteComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, StoreModule.forRoot({}), RouterModule.forRoot([])],
        providers: [CPSession, CPI18nService],
        declarations: [DiningDeleteComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let fixture: ComponentFixture<DiningDeleteComponent>;
  let component: DiningDeleteComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiningDeleteComponent);
    component = fixture.componentInstance;
    component.dining = mockDining[0];
    component.session.g.set('school', mockSchool);
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch DeleteDining action', () => {
    const dispatchSpy = spyOn(component.store, 'dispatch');

    component.onDelete();

    expect(component.store.dispatch).toHaveBeenCalled();

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0];
    const { params, diningId } = payload;
    const expectedParams = new HttpParams().set('school_id', <any>mockSchool.id);

    expect(params).toEqual(expectedParams);
    expect(diningId).toBe(mockDining[0].id);
    expect(type).toBe(fromStore.diningActions.DELETE_DINING);
  });
});
