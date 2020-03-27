import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { Store, StoreModule } from '@ngrx/store';
import { FormBuilder } from '@angular/forms';
import { Actions } from '@ngrx/effects';

import { EmployerModule } from '../employer.module';
import * as fromJobs from '@campus-cloud/store/manage/jobs';
import { EmployerCreateComponent } from './employer-create.component';
import { mockEmployer } from '@controlpanel/manage/jobs/employers/tests';
import { ImageService, ImageValidatorService } from '@campus-cloud/shared/services';
import { configureTestSuite, CPTestModule, MOCK_IMAGE } from '@campus-cloud/shared/tests';
import { READY_MODAL_DATA } from '@ready-education/ready-ui/overlays/modal/modal.service';

describe('EmployerCreateComponent', () => {
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
  let component: EmployerCreateComponent;
  let fixture: ComponentFixture<EmployerCreateComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmployerCreateComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  }));

  it('form validation - should fail', () => {
    expect(component.employerForm.valid).toBeFalsy();
  });

  it('form validation - should pass', () => {
    component.employerForm.controls['name'].setValue('hello world');
    component.employerForm.controls['logo_url'].setValue(MOCK_IMAGE);

    expect(component.disableButton).toBe(false);
    expect(component.employerForm.valid).toBe(true);
  });

  it('form validation - max length 120 - should fail', () => {
    const charCount121 = 'a'.repeat(121);

    component.employerForm.controls['name'].setValue(charCount121);
    component.employerForm.controls['logo_url'].setValue(MOCK_IMAGE);

    expect(component.employerForm.valid).toBe(false);
  });

  it('should dispatch create action', () => {
    spy = spyOn(component.store, 'dispatch');
    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(new fromJobs.CreateEmployer(component.employerForm.value));
  });

  it('should reset modal after create', async(() => {
    spyOn(component, 'resetModal');
    spyOn(component.modal, 'onAction');

    component.store.dispatch(new fromJobs.CreateEmployerSuccess(mockEmployer));
    fixture.detectChanges();

    expect(component.resetModal).toHaveBeenCalled();
    expect(component.modal.onAction).toHaveBeenCalled();
    expect(component.modal.onAction).toHaveBeenCalledWith(component.modal.data);
  }));
});
