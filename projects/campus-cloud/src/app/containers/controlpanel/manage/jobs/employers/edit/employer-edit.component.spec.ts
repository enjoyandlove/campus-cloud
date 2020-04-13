import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule, Store } from '@ngrx/store';
import { FormBuilder } from '@angular/forms';
import { Actions } from '@ngrx/effects';

import { EmployerModule } from '../employer.module';
import * as fromJobs from '@campus-cloud/store/manage/jobs';
import { EmployerEditComponent } from './employer-edit.component';
import { mockEmployer } from '@controlpanel/manage/jobs/employers/tests';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { ImageService, ImageValidatorService } from '@campus-cloud/shared/services';
import { READY_MODAL_DATA } from '@ready-education/ready-ui/overlays/modal/modal.service';

describe('EmployerEditComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [
          CPTestModule,
          EmployerModule,
          HttpClientModule,
          RouterTestingModule,
          StoreModule.forRoot({}, { runtimeChecks: {} })
        ],
        providers: [
          Store,
          Actions,
          FormBuilder,
          ImageService,
          ImageValidatorService,
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
  let component: EmployerEditComponent;
  let fixture: ComponentFixture<EmployerEditComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmployerEditComponent);
    component = fixture.componentInstance;
    component.modal.data = mockEmployer;

    fixture.detectChanges();
  }));

  it('form validation - should fail', () => {
    component.employerForm.controls['name'].setValue(null);
    expect(component.employerForm.valid).toBe(false);
  });

  it('form validation - should pass', () => {
    expect(component.employerForm.valid).toBe(true);
  });

  it('form validation - max length 120 - should fail', () => {
    const charCount121 = 'a'.repeat(121);

    component.employerForm.controls['name'].setValue(charCount121);
    expect(component.employerForm.valid).toBe(false);
  });

  it('save button should be disabled', () => {
    component.employerForm.controls['name'].setValue(null);
    expect(component.disableButton).toBe(true);
  });

  it('save button should be enabled', () => {
    expect(component.disableButton).toBe(true);
  });

  it('should emit edit action', () => {
    spy = spyOn(component.store, 'dispatch');
    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(new fromJobs.EditEmployer(component.employerForm.value));
  });

  it('should reset modal after edit', async(() => {
    spyOn(component, 'resetModal');
    spyOn(component.modal, 'onAction');

    component.store.dispatch(new fromJobs.EditEmployerSuccess(component.modal.data));

    expect(component.resetModal).toHaveBeenCalled();
    expect(component.modal.onAction).toHaveBeenCalled();
    expect(component.modal.onAction).toHaveBeenCalledWith(component.modal.data);
  }));
});
