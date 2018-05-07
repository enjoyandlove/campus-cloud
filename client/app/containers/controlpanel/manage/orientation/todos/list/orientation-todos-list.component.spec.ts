import { async, fakeAsync, tick, TestBed, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

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
        { provide: TodosService, useClass: MockTodosService },
        { provide: ActivatedRoute,
          useValue: {
            snapshot: {
              parent: {
                parent: {
                  params: Observable.of({ orientationId: 1 })
                }
              }
            },
          }
        }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(OrientationTodosListComponent);
        component = fixture.componentInstance;
        service = TestBed.get(TodosService);

        component.session.g.set('school', mockSchool);
        component.orientationId = 5452;
        spy = spyOn(component.service, 'getTodos').and.returnValue(Observable.of(mockTodos));
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

  it('should fetch list of todos', fakeAsync(() => {
    component.ngOnInit();

    tick();
    expect(spy).toHaveBeenCalled();
    expect(spy.calls.count()).toBe(1);
    expect(component.state.todos.length).toEqual(mockTodos.length);

  }));

});
