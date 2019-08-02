import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TodosModule } from '../todos.module';
import { TodosService } from '../todos.service';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { mockTodo, MockTodosService, MockActivatedRoute } from '../tests';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { OrientationTodosListComponent } from './orientation-todos-list.component';

describe('OrientationTodosListComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, TodosModule, RouterTestingModule, HttpClientModule],
        providers: [
          { provide: TodosService, useClass: MockTodosService },
          {
            provide: ActivatedRoute,
            useClass: MockActivatedRoute
          }
        ]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let spy;
  let component: OrientationTodosListComponent;
  let fixture: ComponentFixture<OrientationTodosListComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OrientationTodosListComponent);
    component = fixture.componentInstance;

    component.session.g.set('school', mockSchool);
    component.orientationId = 5452;
    spy = spyOn(component.service, 'getTodos').and.returnValue(of([mockTodo]));
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
    expect(component.state.todos.length).toEqual(1);
  }));
});
