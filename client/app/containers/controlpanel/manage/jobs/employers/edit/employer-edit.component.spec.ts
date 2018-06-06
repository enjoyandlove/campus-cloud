import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf } from 'rxjs';
import { CPSession } from './../../../../../../session';
import { EmployerEditComponent } from './employer-edit.component';
import { mockSchool } from '../../../../../../session/mock/school';
import { CPI18nService } from '../../../../../../shared/services/i18n.service';
import { EmployerModule } from '../employer.module';
import { EmployerService } from '../employer.service';

class MockEmployerService {
  dummy;

  editEmployer(body: any, search: any) {
    this.dummy = [search];

    return observableOf(body);
  }
}

describe('EmployerEditComponent', () => {
  let spy;
  let component: EmployerEditComponent;
  let fixture: ComponentFixture<EmployerEditComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule, EmployerModule, RouterTestingModule],
        providers: [
          CPSession,
          FormBuilder,
          CPI18nService,
          { provide: EmployerService, useClass: MockEmployerService }
        ]
      })
        .compileComponents()
        .then(() => {
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

          component.ngOnInit();
        });
    })
  );

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

  it('should edit employer', () => {
    spyOn(component.edited, 'emit');
    spyOn(component, 'resetModal');
    spy = spyOn(component.service, 'editEmployer').and.returnValue(
      observableOf(component.employer)
    );

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);

    expect(component.edited.emit).toHaveBeenCalledTimes(1);
    expect(component.edited.emit).toHaveBeenCalledWith(component.employer);

    expect(component.resetModal).toHaveBeenCalled();
    expect(component.resetModal).toHaveBeenCalledTimes(1);
  });
});
