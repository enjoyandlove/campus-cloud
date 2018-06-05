import { HttpParams } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { CPSession } from './../../../../../session';
import { OrientationProgramCreateComponent } from './orientation-program-create.component';
import { mockSchool } from '../../../../../session/mock/school';
import { CPI18nService } from '../../../../../shared/services/i18n.service';
import { OrientationModule } from '../orientation.module';
import { OrientationService } from '../orientation.services';
import { ProgramMembership } from '../orientation.status';

class MockOrientationService {
  dummy;

  createProgram(body: any, search: any) {
    this.dummy = [search];

    return observableOf(body);
  }
}

class RouterMock {
  navigate() {}
}

describe('OrientationProgramCreateComponent', () => {
  let spy;
  let search;
  let component: OrientationProgramCreateComponent;
  let service: OrientationService;
  let fixture: ComponentFixture<OrientationProgramCreateComponent>;

  const createdProgram = {
    id: 84,
    name: 'Hello World!',
    description: 'This is description',
    events: 12,
    members: 10,
    start: '1557637200',
    end: '1557637200',
    has_membership: 1
  };

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [OrientationModule],
        providers: [
          CPSession,
          FormBuilder,
          CPI18nService,
          { provide: Router, useClass: RouterMock },
          { provide: OrientationService, useClass: MockOrientationService }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(OrientationProgramCreateComponent);
          component = fixture.componentInstance;
          service = TestBed.get(OrientationService);

          component.session.g.set('school', mockSchool);
          search = new HttpParams().append(
            'school_id',
            component.session.g.get('school').id.toString()
          );

          component.ngOnInit();
        });
    })
  );

  it('form validation - should fail', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('form validation - should pass', () => {
    component.form.controls['name'].setValue('hello world');
    expect(component.form.valid).toBeTruthy();
  });

  it('form validation - max length 225 - should fail', () => {
    const charCount226 = 'a'.repeat(226);

    component.form.controls['name'].setValue(charCount226);
    expect(component.form.valid).toBeFalsy();
  });

  it('cp button should have disabled state TRUE', () => {
    expect(component.buttonData.disabled).toBeTruthy();
  });

  it('cp button should have disabled state FALSE', () => {
    component.form.controls['name'].setValue('hello world');
    expect(component.buttonData.disabled).toBeFalsy();
  });

  it('should insert orientation program', () => {
    spyOn(component, 'resetModal');
    spy = spyOn(component.service, 'createProgram').and.returnValue(observableOf(createdProgram));

    component.form = component.fb.group({
      name: ['Hello World!'],
      description: ['This is description'],
      has_membership: [ProgramMembership.enabled]
    });

    component.onSubmit();
    expect(spy).toHaveBeenCalled();
    expect(spy.calls.count()).toBe(1);
  });
});
