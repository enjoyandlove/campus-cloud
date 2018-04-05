import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { URLSearchParams } from '@angular/http';

import { TodosModule } from '../todos.module';
import { TodosService } from '../todos.service';
import { CPSession } from '../../../../../../session';
import { mockSchool } from '../../../../../../session/mock/school';
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
  let spy;
  let search;
  let service: TodosService;
  let component: OrientationTodosListComponent;
  let fixture: ComponentFixture<OrientationTodosListComponent>;

  const mockTodos = require('../../mock.json');

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

        component.session.g.set('school', mockSchool);

        search = new URLSearchParams();
        search.append('search_str', component.state.search_str);
        search.append('sort_field', component.state.sort_field);
        search.append('sort_direction', component.state.sort_direction);
        search.append('school_id', component.session.g.get('school').id.toString());

      });
  }));

  it('should search string', () => {
    component.onSearch('hello world');
    expect(component.state.search_str).toEqual('hello world');
  });

  it('should launch create modal', () => {
    expect(component.launchCreateModal).toBeFalsy();
    component.onLaunchCreateModal();
    expect(component.launchCreateModal).toBeTruthy();
  });

  it('should fetch list of todos', () => {
    spy = spyOn(component.service, 'getTodos').and.returnValue(Observable.of(mockTodos));
    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
    expect(spy.calls.count()).toBe(1);
  });

});
