import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { HttpParams, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { FormBuilder } from '@angular/forms';

import { EmployerModule } from '../employer.module';
import { EmployerService } from '../employer.service';
import { CPSession } from './../../../../../../session';
import { EmployerEditComponent } from './employer-edit.component';
import { mockSchool } from '../../../../../../session/mock/school';
import { CPI18nService } from '../../../../../../shared/services/i18n.service';

class MockEmployerService {
  dummy;

  editEmployer(body: any, search: any) {
    this.dummy = [search];

    return Observable.of(body);
  }
}

describe('EmployerEditComponent', () => {
  let spy;
  let search;
  let component: EmployerEditComponent;
  let service: EmployerService;
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
          service = TestBed.get(EmployerService);

          component.session.g.set('school', mockSchool);
          search = new HttpParams().append(
            'school_id',
            component.session.g.get('school').id.toString()
          );

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
      Observable.of(component.employer)
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
