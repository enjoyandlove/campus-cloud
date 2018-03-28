import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { TodosModule } from '../todos.module';
import { TodosService } from '../todos.service';
import { CPSession } from '../../../../../../session';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';
import { OrientationTodosListComponent } from './orientation-todos-list.component';

class MockTodosService {
  dummy;
  mockTodos = require('../mockTodos.json');

  getTodos(startRage: number, endRage: number, search: any) {
    this.dummy = [startRage, endRage, search];

    return Observable.of(this.mockTodos);
  }
}

describe('OrientationTodosListComponent', () => {
  let compSpy;
  let resTodos;
  let mockTodos;
  let service: TodosService;
  let component: OrientationTodosListComponent;
  let fixture: ComponentFixture<OrientationTodosListComponent>;

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
        fixture = TestBed.createComponent(OrientationTodosListComponent);
        component = fixture.componentInstance;
        service = TestBed.get(TodosService);
        compSpy = spyOn(component, 'fetch');
      });
  }));

  it('should fetch list of todos', () => {
    mockTodos = require('../mockTodos.json');
    resTodos = service.getTodos(0, 0, null);

    expect(compSpy).not.toHaveBeenCalled();
    component.fetch();
    expect(compSpy).toHaveBeenCalled();

    expect(resTodos.value.length).toEqual(mockTodos.length);
    expect(resTodos).toEqual(Observable.of(mockTodos));
  });

  it('should search string', () => {
    component.onSearch('hello world');
    expect(component.state.search_str).toEqual('hello world');
  });

});
