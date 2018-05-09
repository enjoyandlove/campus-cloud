import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { URLSearchParams, HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { FormBuilder } from '@angular/forms';

import { EmployerModule } from '../employer.module';
import { EmployerService } from '../employer.service';
import { CPSession } from './../../../../../../session';
import { mockSchool } from '../../../../../../session/mock/school';
import { EmployerCreateComponent } from './employer-create.component';
import { CPI18nService } from '../../../../../../shared/services/i18n.service';

class MockEmployerService {
  dummy;

  createEmployer(body: any, search: any) {
    this.dummy = [search];

    return Observable.of(body);
  }
}

describe('EmployerCreateComponent', () => {
  let spy;
  let search;
  let component: EmployerCreateComponent;
  let service: EmployerService;
  let fixture: ComponentFixture<EmployerCreateComponent>;

  const newEmployer = {
    'id': 84,
    'name': 'Hello World!',
    'description': 'This is description',
    'email': 'test@test.com',
    'logo_url': ''
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        EmployerModule
      ],
      providers: [
        CPSession,
        FormBuilder,
        CPI18nService,
        { provide: EmployerService, useClass: MockEmployerService },
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(EmployerCreateComponent);
      component = fixture.componentInstance;
      service = TestBed.get(EmployerService);

      search = new URLSearchParams();
      component.session.g.set('school', mockSchool);
      search.append('school_id', component.session.g.get('school').id.toString());

      component.ngOnInit();
    });
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

  it('should create employer', () => {
    spyOn(component.created, 'emit');
    spyOn(component, 'resetModal');
    spy = spyOn(component.service, 'createEmployer').and.returnValue(Observable.of(newEmployer));

    component.employerForm = component.fb.group({
      name: ['Hello World!'],
      description: ['This is description'],
      email: ['test@test.com'],
      logo_url: ['dummy.jpeg']
    });

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);

    expect(component.created.emit).toHaveBeenCalledTimes(1);
    expect(component.created.emit).toHaveBeenCalledWith(newEmployer);

    expect(component.resetModal).toHaveBeenCalled();
    expect(component.resetModal).toHaveBeenCalledTimes(1);
  });

});
