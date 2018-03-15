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
    'name': 'new list with no duplicates',
    'description': 'fdsafsd',
    'events': 12,
    'members': 10,
    'start': '1557637200',
    'end': '1557637200',
    'is_membership': 0
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

  it('should insert orientation program', () => {
    spy = spyOn(component, 'onSubmit');
    expect(spy).not.toHaveBeenCalled();
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
    expect(service.createProgram(mockProgram, null)).toEqual(Observable.of(mockProgram));
  });

});
