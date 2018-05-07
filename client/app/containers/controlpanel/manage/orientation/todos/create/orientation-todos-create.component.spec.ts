import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TodosModule } from '../todos.module';
import { TodosService } from '../todos.service';
import { CPSession } from '../../../../../../session';
import { mockSchool } from '../../../../../../session/mock/school';
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

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [TodosModule],
        providers: [
          CPSession,
          FormBuilder,
          CPI18nService,
          { provide: TodosService, useClass: MockTodosService },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                parent: {
                  parent: {
                    params: Observable.of({ orientationId: 1 })
                  }
                }
              }
            }
          }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(OrientationTodosCreateComponent);
          component = fixture.componentInstance;
          service = TestBed.get(TodosService);

          component.session.g.set('school', mockSchool);
          component.ngOnInit();
        });
    })
  );

  it('form validation - should fail', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('form validation - should pass', () => {
    component.form.controls['title'].setValue('Hello World!');
    component.form.controls['end'].setValue(1515625016);
    expect(component.form.valid).toBeTruthy();
  });

  it('form validation - max length 225 - should fail', () => {
    const charCount226 = 'a'.repeat(226);

    component.form.controls['title'].setValue(charCount226);
    component.form.controls['end'].setValue(1515625016);
    expect(component.form.valid).toBeFalsy();
  });

  it('cp button should have disabled state TRUE', () => {
    expect(component.buttonData.disabled).toBeTruthy();
  });

  it('cp button should have disabled state FALSE', () => {
    component.form.controls['title'].setValue('Hello World!');
    component.form.controls['end'].setValue(1515625016);
    expect(component.buttonData.disabled).toBeFalsy();
  });

  it('should insert todo', () => {
    component.orientationId = 4525;
    spyOn(component, 'resetModal');
    spy = spyOn(component.service, 'createTodo').and.returnValue(Observable.of([]));

    component.form = component.fb.group({
      title: ['Hello World!'],
      description: ['This is description'],
      end: [1515625016]
    });

    component.onSubmit();
    expect(spy).toHaveBeenCalled();
    expect(spy.calls.count()).toBe(1);
  });
});
