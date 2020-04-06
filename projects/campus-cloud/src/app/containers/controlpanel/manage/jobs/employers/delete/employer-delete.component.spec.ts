import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EmployerModule } from '../employer.module';
import * as fromJobs from '@campus-cloud/store/manage/jobs';
import { EmployerDeleteComponent } from './employer-delete.component';
import { mockEmployer } from '@controlpanel/manage/jobs/employers/tests';
import { CPDeleteModalComponent } from '@campus-cloud/shared/components';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { READY_MODAL_DATA } from '@ready-education/ready-ui/overlays/modal/modal.service';

describe('EmployerDeleteComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [
          CPTestModule,
          EmployerModule,
          RouterTestingModule,
          StoreModule.forRoot({}, { runtimeChecks: {} })
        ],
        providers: [
          Store,
          Actions,
          {
            provide: READY_MODAL_DATA,
            useValue: {
              onClose: () => {},
              onAction: () => {},
              data: mockEmployer
            }
          }
        ]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let spy;
  let de: DebugElement;
  let component: EmployerDeleteComponent;
  let cpDeleteModal: CPDeleteModalComponent;
  let fixture: ComponentFixture<EmployerDeleteComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmployerDeleteComponent);
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
    spy = spyOn(component.store, 'dispatch');
    component.onDelete();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(new fromJobs.DeleteEmployer(mockEmployer.id));
  });

  it('should emit after delete', async(() => {
    spyOn(component, 'resetModal');
    spyOn(component.modal, 'onAction');

    component.store.dispatch(new fromJobs.DeleteEmployerSuccess(mockEmployer.id));
    fixture.detectChanges();

    expect(component.resetModal).toHaveBeenCalled();
    expect(component.modal.onAction).toHaveBeenCalled();
    expect(component.modal.onAction).toHaveBeenCalledWith(mockEmployer.id);
  }));
});
