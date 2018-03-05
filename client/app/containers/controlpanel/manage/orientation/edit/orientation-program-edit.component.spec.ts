import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { CPSession } from './../../../../../session';
import { Observable } from 'rxjs/Observable';
import { FormBuilder } from '@angular/forms';

import { OrientationService } from '../orientation.services';
import { OrientationProgramEditComponent } from './orientation-program-edit.component';

class MockOrientationService {
  dummy;
  program;
  mockPrograms = require('../mock.json');
  editOrientationProgram(programId: number, body: any, search: any) {
    this.dummy = [search];
    this.program = this.mockPrograms.filter((item) => item.id === programId);
    this.program = body;

    return Observable.of(this.program);
  }
}

describe('OrientationProgramEditComponent', () => {
  let spy;
  let component: OrientationProgramEditComponent;
  let service: OrientationService;
  let fixture: ComponentFixture<OrientationProgramEditComponent>;

  const mockProgram = {
    'id': 84,
    'name': 'This is new edited name',
    'description': 'this is new edited description',
    'events': 20,
    'members': 30,
    'start': '1557637200',
    'end': '1557637200',
    'is_membership': 1
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrientationProgramEditComponent ],
      providers: [
        CPSession,
        FormBuilder,
        { provide: OrientationService, useClass: MockOrientationService },
      ]
    }) .overrideComponent(OrientationProgramEditComponent, {
      set: {
        template: '<div>No Template</div>'
      }
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(OrientationProgramEditComponent);
      component = fixture.componentInstance;
      service = TestBed.get(OrientationService);
    });
  }));

  it('Should insert orientation program', () => {
    spy = spyOn(component, 'onSubmit');
    expect(spy).not.toHaveBeenCalled();
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
    expect(service.editOrientationProgram(84, mockProgram, null))
      .toEqual(Observable.of(mockProgram));
  });

});
