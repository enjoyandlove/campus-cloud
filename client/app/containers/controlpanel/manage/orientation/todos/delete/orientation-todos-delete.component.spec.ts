import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { URLSearchParams } from '@angular/http';

import { TodosModule } from '../todos.module';
import { TodosService } from '../todos.service';
import { CPSession } from '../../../../../../session';
import { mockSchool } from '../../../../../../session/mock/school';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';
import { OrientationTodosDeleteComponent } from './orientation-todos-delete.component';

class MockTodosService {
  dummy;
  mockTodo = [{
      'due_date': 1515625016,
      'description': 'Some description',
      'id': 240786,
      'name': 'Hello World!'
  }];

  deleteTodo(todoId: number, search: any) {
    this.dummy = [search];
    const afterDeletedTodo = this.mockTodo.filter((item) => item.id !== todoId);

    return Observable.of(afterDeletedTodo);
  }
}

describe('OrientationTodosDeleteComponent', () => {
  let spy;
  let search;
  let service: TodosService;
  let component: OrientationTodosDeleteComponent;
  let fixture: ComponentFixture<OrientationTodosDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TodosModule],
      providers: [
        CPSession,
        CPI18nService,
        { provide: TodosService, useClass: MockTodosService }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(OrientationTodosDeleteComponent);
        component = fixture.componentInstance;
        service = TestBed.get(TodosService);

        search = new URLSearchParams();
        component.session.g.set('school', mockSchool);
        search.append('school_id', component.session.g.get('school').id.toString());

        component.todo = {
          id: 54856,
          name: 'Hello World!',
          description: 'This is description',
          due_date: 1557637200
        };
      });
  }));

  it('buttonData should have "Delete" label & "Danger class"', () => {
    component.ngOnInit();
    expect(component.buttonData.text).toEqual('Delete');
    expect(component.buttonData.class).toEqual('danger');
  });

  it('should delete todo', () => {
    spy = spyOn(component.service, 'deleteTodo').and.returnValue(Observable.of({}));

    component.onDelete();
    expect(spy).toHaveBeenCalledWith(component.todo.id, search);
    expect(spy.calls.count()).toBe(1);

  });

});
