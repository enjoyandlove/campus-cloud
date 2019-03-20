import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { configureTestSuite } from '@shared/tests';
import { SharedModule } from '@shared/shared.module';
import { CPDeleteModalComponent } from '@shared/components';
import { CPI18nService, MODAL_DATA } from '@shared/services';
import { mockCategories } from '@libs/locations/common/categories/tests';
import { DiningCategoriesDeleteComponent } from './dining-categories-delete.component';

describe('DiningCategoriesDeleteComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, StoreModule.forRoot({})],
        declarations: [DiningCategoriesDeleteComponent],
        providers: [
          CPSession,
          CPI18nService,
          {
            provide: MODAL_DATA,
            useValue: {
              onClose: () => {},
              data: mockCategories[0]
            }
          }
        ]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let de: DebugElement;
  let cpDeleteModal: CPDeleteModalComponent;
  let fixture: ComponentFixture<DiningCategoriesDeleteComponent>;
  let component: DiningCategoriesDeleteComponent;

  beforeEach(
    async(() => {
      fixture = TestBed.createComponent(DiningCategoriesDeleteComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      cpDeleteModal = de.query(By.directive(CPDeleteModalComponent)).componentInstance;

      fixture.detectChanges();
    })
  );

  it('should init', () => {
    expect(component).toBeTruthy();
  });

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

  it('should dispatch DeleteCategories action', () => {
    const dispatchSpy = spyOn(component.store, 'dispatch');

    cpDeleteModal.deleteClick.emit();

    expect(component.store.dispatch).toHaveBeenCalled();

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0];

    expect(payload).toEqual(mockCategories[0]);
    expect(type).toBe(fromStore.CategoriesActions.DELETE_CATEGORIES);
  });
});
