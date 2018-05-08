import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { TodosModule } from '../todos.module';
import { TodosService } from '../todos.service';
import { CPSession } from '../../../../../../session';
import { mockSchool } from '../../../../../../session/mock/school';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';
import { OrientationTodosDeleteComponent } from './orientation-todos-delete.component';

class MockTodosService {
  dummy;

  deleteTodo(todoId: number, search: any) {
    this.dummy = [todoId, search];

    return Observable.of(Observable.of({}));
  }
}

describe('OrientationTodosDeleteComponent', () => {
  let spy;
  let search;
  let service: TodosService;
  let component: OrientationTodosDeleteComponent;
  let fixture: ComponentFixture<OrientationTodosDeleteComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [TodosModule, RouterTestingModule],
        providers: [CPSession, CPI18nService, { provide: TodosService, useClass: MockTodosService }]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(OrientationTodosDeleteComponent);
          component = fixture.componentInstance;
          service = TestBed.get(TodosService);

          component.session.g.set('school', mockSchool);

          search = new HttpParams().append(
            'school_id',
            component.session.g.get('school').id.toString()
          );

          component.todo = {
            id: 54856,
            title: 'Hello World!',
            description: 'This is description',
            end: 1557637200
          };
        });
    })
  );

  it('buttonData should have "Delete" label & "Danger class"', () => {
    component.ngOnInit();
    expect(component.buttonData.text).toEqual('Delete');
    expect(component.buttonData.class).toEqual('danger');
  });

  it('should delete todo', () => {
    spy = spyOn(component.service, 'deleteTodo').and.returnValue(Observable.of({}));

    component.onDelete();
    expect(spy.calls.count()).toBe(1);
    expect(spy).toHaveBeenCalledWith(component.todo.id, search);
  });
});
