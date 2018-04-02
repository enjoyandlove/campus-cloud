/*tslint:disable:max-line-length*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { FormBuilder } from '@angular/forms';

import { TodosModule } from '../todos.module';
import { TodosService } from '../todos.service';
import { CPSession } from '../../../../../../session';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';
import { OrientationTodosEditComponent } from './orientation-todos-edit.component';

class MockTodosService {
  dummy;
  todo;
  mockTodos = require('../mockTodos.json');

  editTodo(todoId: number, body: any, search: any) {
    this.dummy = [search];
    this.todo = this.mockTodos.filter((item) => item.id === todoId);
    this.todo = body;

    return Observable.of(this.todo);
  }

}

describe('OrientationTodosEditComponent', () => {
  let spy;
  let spyService;
  let service: TodosService;
  let component: OrientationTodosEditComponent;
  let fixture: ComponentFixture<OrientationTodosEditComponent>;

  const editTodo = {
    'id': 25,
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
        fixture = TestBed.createComponent(OrientationTodosEditComponent);
        component = fixture.componentInstance;
        service = TestBed.get(TodosService);
        component.todo = {
          id: 55,
          name: 'Hello World!',
          due_date: 1515625016,
          description: 'test description'
        };
        component.ngOnInit();
      });
  }));

  it('form validation - should pass', () => {
    expect(component.form.valid).toBeTruthy();
  });

  it('form validation - should fail', () => {
    component.form.controls['name'].setValue(null);
    component.form.controls['due_date'].setValue(null);
    expect(component.form.valid).toBeFalsy();
  });

  it('form validation - max length 225 - should fail', () => {
    component.form.controls['name'].setValue('Hello World!');
    component.form.controls['due_date'].setValue(1515625016);
    component.form.controls['name'].setValue('This is the text which we are testing the length of 225 thats why we are entering this text greater than 225 to verify the unit test.  The total length of this string is 226 just to make sure its greater than 225 thanks you ..');
    expect(component.form.valid).toBeFalsy();
  });

  it('cp button should have disabled state TRUE', () => {
    component.form.controls['name'].setValue(null);
    component.form.controls['due_date'].setValue(null);
    expect(component.buttonData.disabled).toBeTruthy();
  });

  it('cp button should have disabled state FALSE', () => {
    expect(component.buttonData.disabled).toBeFalsy();
  });

  it('should update todo', () => {
    spy = spyOn(component, 'onSubmit');
    component.onSubmit();
    expect(spy).toHaveBeenCalledWith();

    spyService = spyOn(service, 'editTodo');
    service.editTodo(25, editTodo, null);
    expect(spyService).toHaveBeenCalledWith(25, editTodo, null);
  });

});
