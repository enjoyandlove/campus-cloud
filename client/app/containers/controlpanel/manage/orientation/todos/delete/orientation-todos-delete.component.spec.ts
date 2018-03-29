import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { TodosModule } from '../todos.module';
import { TodosService } from '../todos.service';
import { CPSession } from '../../../../../../session';
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
        spy = spyOn(component, 'onDelete');
      });
  }));

  it('buttonData should have "Delete" label', () => {
    component.ngOnInit();
    expect(component.buttonData.text).toEqual('delete');
    expect(component.buttonData.class).toEqual('danger');
  });

  it('should delete todo', () => {
    expect(spy).not.toHaveBeenCalled();
    component.onDelete();
    expect(spy).toHaveBeenCalled();
    expect(service.deleteTodo(240786, null)).toEqual(Observable.of([]));
  });

});
