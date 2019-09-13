import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import * as fromStore from '../store';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { DiningDeleteComponent } from './dining-delete.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { mockLocations as mockDining } from '@campus-cloud/libs/locations/common/tests';

describe('DiningDeleteComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule],
        providers: [provideMockStore()],
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

  it('should dispatch DeleteDining action', () => {
    const dispatchSpy = spyOn(component.store, 'dispatch');

    component.onDelete();

    expect(component.store.dispatch).toHaveBeenCalled();

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0] as any;

    expect(payload).toBe(mockDining[0]);
    expect(type).toBe(fromStore.diningActions.DELETE_DINING);
  });
});
