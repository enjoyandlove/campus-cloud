/*tslint:disable:max-line-length*/
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { CPSession } from './../../../../../session';
import { Observable } from 'rxjs/Observable';
import { FormBuilder } from '@angular/forms';

import { OrientationService } from '../orientation.services';
import { OrientationProgramCreateComponent } from './orientation-program-create.component';
import { CPI18nService } from '../../../../../shared/services/i18n.service';

class MockOrientationService {
  dummy;

  createProgram(body: any, search: any) {
    this.dummy = [search];

    return Observable.of(body);
  }
}

describe('OrientationProgramCreateComponent', () => {
  let spy;
  let component: OrientationProgramCreateComponent;
  let service: OrientationService;
  let fixture: ComponentFixture<OrientationProgramCreateComponent>;

  const mockProgram = {
    'id': 84,
    'name': 'Hello World!',
    'description': 'This is description',
    'events': 12,
    'members': 10,
    'start': '1557637200',
    'end': '1557637200',
    'has_membership': 0
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrientationProgramCreateComponent ],
      providers: [
        CPSession,
        FormBuilder,
        CPI18nService,
        { provide: OrientationService, useClass: MockOrientationService },
      ]
    }) .overrideComponent(OrientationProgramCreateComponent, {
      set: {
        template: '<div>No Template</div>'
      }
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(OrientationProgramCreateComponent);
      component = fixture.componentInstance;
      service = TestBed.get(OrientationService);
    });
  }));

  it('form validation - should fail', () => {
    component.ngOnInit();
    expect(component.form.valid).toBeFalsy();
  });

  it('form validation - should pass', () => {
    component.ngOnInit();
    component.form.controls['name'].setValue('hello world');
    expect(component.form.valid).toBeTruthy();
  });

  it('form validation - max length 225 - should fail', () => {
    component.ngOnInit();
    component.form.controls['name'].setValue('This is the text which we are testing the length of 225 thats why we are entering this text greater than 225 to verify the unit test.  The total length of this string is 226 just to make sure its greater than 225 thanks you ..');
    expect(component.form.valid).toBeFalsy();
  });

  it('cp button should have disabled state TRUE', () => {
    component.ngOnInit();
    expect(component.buttonData.disabled).toBeTruthy();
  });

  it('cp button should have disabled state FALSE', () => {
    component.ngOnInit();
    component.form.controls['name'].setValue('hello world');
    expect(component.buttonData.disabled).toBeFalsy();
  });

  it('should insert orientation program', () => {
    spy = spyOn(component, 'onSubmit');
    expect(spy).not.toHaveBeenCalled();
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
    expect(service.createProgram(mockProgram, null)).toEqual(Observable.of(mockProgram));
  });

});
