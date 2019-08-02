import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule, Store } from '@ngrx/store';
import { FormBuilder } from '@angular/forms';
import { Actions } from '@ngrx/effects';

import { EmployerModule } from '../employer.module';
import * as fromJobs from '@campus-cloud/store/manage/jobs';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { EmployerEditComponent } from './employer-edit.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';

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
          StoreModule.forRoot({})
        ],
        providers: [Store, Actions, FormBuilder]
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

    component.session.g.set('school', mockSchool);

    component.employer = {
      id: 84,
      name: 'Hello World!',
      description: 'This is description',
      email: 'test@test.com',
      logo_url: 'dummy.jpeg'
    };
    fixture.detectChanges();
  }));

  it('form validation - should fail', () => {
    component.employerForm.controls['name'].setValue(null);
    expect(component.employerForm.valid).toBeFalsy();
  });

  it('form validation - should pass', () => {
    expect(component.employerForm.valid).toBeTruthy();
  });

  it('form validation - max length 120 - should fail', () => {
    const charCount121 = 'a'.repeat(121);

    component.employerForm.controls['name'].setValue(charCount121);
    expect(component.employerForm.valid).toBeFalsy();
  });

  it('save button should be disabled', () => {
    component.employerForm.controls['name'].setValue(null);
    expect(component.buttonData.disabled).toBeTruthy();
  });

  it('save button should be enabled', () => {
    expect(component.buttonData.disabled).toBeFalsy();
  });

  it('should emit edit action', () => {
    spy = spyOn(component.store, 'dispatch');
    component.onSubmit();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(new fromJobs.EditEmployer(component.employerForm.value));
  });

  it('should emit after edit', async(() => {
    spyOn(component.edited, 'emit');
    spyOn(component, 'resetModal');

    component.store.dispatch(new fromJobs.EditEmployerSuccess(component.employer));

    expect(component.edited.emit).toHaveBeenCalledTimes(1);
    expect(component.edited.emit).toHaveBeenCalledWith(component.employer);
    expect(component.resetModal).toHaveBeenCalledTimes(1);
  }));
});
