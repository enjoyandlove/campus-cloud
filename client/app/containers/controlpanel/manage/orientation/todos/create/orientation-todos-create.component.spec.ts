/*tslint:disable:max-line-length*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { FormBuilder } from '@angular/forms';

import { TodosModule } from '../todos.module';
import { TodosService } from '../todos.service';
import { CPSession } from '../../../../../../session';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';
import { OrientationTodosCreateComponent } from './orientation-todos-create.component';

class MockTodosService {
  dummy;

  createTodo(body: any, search: any) {
    this.dummy = [search];

    return Observable.of(body);
  }
}

describe('OrientationTodosCreateComponent', () => {
  let spy;
  let service: TodosService;
  let component: OrientationTodosCreateComponent;
  let fixture: ComponentFixture<OrientationTodosCreateComponent>;

  const mockTodo = {
    'name': 'Hello World!',
    'due_date': 1515625016,
    'description': 'Some description',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TodosModule],
      providers: [
        CPSession,
        FormBuilder,
        CPI18nService,
        { provide: TodosService, useClass: MockTodosService }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(OrientationTodosCreateComponent);
        component = fixture.componentInstance;
        service = TestBed.get(TodosService);
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
    component.form.controls['name'].setValue('This is the text which we are testing the length of 225 thats why we are entering this text greater than 225 to verify the unit test.  The total length of this string is 226 just to make sure its greater than 225 thanks you');
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

  it('should insert todo', () => {
    spy = spyOn(component, 'onSubmit');
    expect(spy).not.toHaveBeenCalled();
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
    expect(service.createTodo(mockTodo, null)).toEqual(Observable.of(mockTodo));
  });

  });
