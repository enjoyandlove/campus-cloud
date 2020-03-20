import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';

import { reducers } from '../store';
import { RootStoreModule } from '@campus-cloud/store';
import { MODAL_DATA } from '@campus-cloud/shared/services';
import { ApiDeleteComponent } from './api-delete.component';
import { CustomSerializer } from '@campus-cloud/store/serializers';
import { CPDeleteModalComponent } from '@campus-cloud/shared/components';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { mockAPIData } from '@controlpanel/campus-app-management/api-management/tests';

describe('ApiDeleteComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [ApiDeleteComponent],
        providers: [
          { provide: RouterStateSerializer, useClass: CustomSerializer },
          {
            provide: MODAL_DATA,
            useValue: {
              data: mockAPIData[0],
              onClose: () => {}
            }
          }
        ],
        imports: [
          CPTestModule,
          RootStoreModule,
          StoreRouterConnectingModule.forRoot(),
          StoreModule.forFeature('apiManagement', reducers)
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let de: DebugElement;
  let component: ApiDeleteComponent;
  let cpDeleteModal: CPDeleteModalComponent;
  let fixture: ComponentFixture<ApiDeleteComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ApiDeleteComponent);
    component = fixture.componentInstance;

    de = fixture.debugElement;
    cpDeleteModal = de.query(By.directive(CPDeleteModalComponent)).componentInstance;

    fixture.detectChanges();
  }));

  it('should call modal.onClose on cancelClick', () => {
    spyOn(component.modal, 'onClose');

    cpDeleteModal.cancelClick.emit();

    expect(component.modal.onClose).toHaveBeenCalled();
  });

  it('should call onDelete on cp-delete-modal deleteClick event', () => {
    spyOn(component, 'onDelete');

    cpDeleteModal.deleteClick.emit();

    expect(component.onDelete).toHaveBeenCalled();
  });

  it('should dispatch delete action', () => {
    const dispatchSpy = spyOn(component.store, 'dispatch');

    cpDeleteModal.deleteClick.emit();

    expect(component.store.dispatch).toHaveBeenCalled();

    const { payload } = dispatchSpy.calls.mostRecent().args[0] as any;

    expect(payload).toEqual(mockAPIData[0]);
  });
});
