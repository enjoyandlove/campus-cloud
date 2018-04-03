import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { CPSession } from './../../../../../session';
import { Observable } from 'rxjs/Observable';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

import { OrientationService } from '../orientation.services';
import { OrientationProgramDeleteComponent } from './orientation-program-delete.component';

class MockOrientationService {
  dummy;
  mockProgram = [{
    'id': 84,
    'name': 'Hello World!',
    'description': 'This is description',
    'events': 12,
    'members': 10,
    'start': '1557637200',
    'end': '1557637200',
    'has_membership': 0
  }];

  deleteProgram(programId: number, search: any) {
    this.dummy = [search];
    const afterDeletedPrograms = this.mockProgram.filter((item) => item.id !== programId);

    return Observable.of(afterDeletedPrograms);
  }
}

describe('OrientationProgramDeleteComponent', () => {
  let spy;
  let spyservice;
  let component: OrientationProgramDeleteComponent;
  let service: OrientationService;
  let fixture: ComponentFixture<OrientationProgramDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrientationProgramDeleteComponent ],
      providers: [
        CPSession,
        CPI18nService,
        { provide: OrientationService, useClass: MockOrientationService },
      ]
    }) .overrideComponent(OrientationProgramDeleteComponent, {
      set: {
        template: '<div>No Template</div>'
      }
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(OrientationProgramDeleteComponent);
      component = fixture.componentInstance;
      service = TestBed.get(OrientationService);
      spy = spyOn(component, 'onDelete');
    });
  }));

  it('buttonData should have "Delete" label & "Danger class"', () => {
    component.ngOnInit();
    expect(component.buttonData.text).toEqual('Delete');
    expect(component.buttonData.class).toEqual('danger');
  });

  it('should delete orientation program', () => {
    component.onDelete();
    expect(spy).toHaveBeenCalledWith();

    spyservice = spyOn(service, 'deleteProgram');
    service.deleteProgram(84, null);
    expect(spyservice).toHaveBeenCalledWith(84, null);
  });

});
