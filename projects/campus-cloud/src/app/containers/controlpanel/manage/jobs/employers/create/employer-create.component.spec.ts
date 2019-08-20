import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { Store, StoreModule } from '@ngrx/store';
import { FormBuilder } from '@angular/forms';
import { Actions } from '@ngrx/effects';

import { EmployerModule } from '../employer.module';
import * as fromJobs from '@campus-cloud/store/manage/jobs';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { EmployerCreateComponent } from './employer-create.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { ImageService, ImageValidatorService } from '@campus-cloud/shared/services';

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
        providers: [Store, Actions, FormBuilder, ImageService, ImageValidatorService]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let spy;
  let component: EmployerCreateComponent;
  let fixture: ComponentFixture<EmployerCreateComponent>;

  const newEmployer = {
    id: 84,
    name: 'Hello World!',
    description: 'This is description',
    email: 'test@test.com',
    logo_url: ''
  };

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmployerCreateComponent);
    component = fixture.componentInstance;

    component.session.g.set('school', mockSchool);
    fixture.detectChanges();
  }));

  it('form validation - should fail', () => {
    expect(component.employerForm.valid).toBeFalsy();
  });

  it('form validation - should pass', () => {
    component.employerForm.controls['name'].setValue('hello world');
    component.employerForm.controls['logo_url'].setValue('dummy.png');
    expect(component.employerForm.valid).toBeTruthy();
  });

  it('form validation - max length 120 - should fail', () => {
    const charCount121 = 'a'.repeat(121);

    component.employerForm.controls['name'].setValue(charCount121);
    component.employerForm.controls['logo_url'].setValue('dummy.png');

    expect(component.employerForm.valid).toBeFalsy();
  });

  it('save button should be disabled', () => {
    expect(component.buttonData.disabled).toBeTruthy();
  });

  it('save button should be enabled', () => {
    component.employerForm.controls['name'].setValue('hello world');
    component.employerForm.controls['logo_url'].setValue('dummy.png');

    expect(component.buttonData.disabled).toBeFalsy();
  });

  it('should dispatch create action', () => {
    spy = spyOn(component.store, 'dispatch');
    component.onSubmit();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(new fromJobs.CreateEmployer(component.employerForm.value));
  });

  it('should emit after create', async(() => {
    spyOn(component.created, 'emit');
    spyOn(component, 'resetModal');

    component.store.dispatch(new fromJobs.CreateEmployerSuccess(newEmployer));
    fixture.detectChanges();

    expect(component.created.emit).toHaveBeenCalledTimes(1);
    expect(component.created.emit).toHaveBeenCalledWith(newEmployer);
    expect(component.resetModal).toHaveBeenCalledTimes(1);
  }));
});
