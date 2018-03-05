import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CPSession } from './../../../../../session';
import { Observable } from 'rxjs/Observable';

import { OrientationInfoComponent } from './orientation-info.component';
import { OrientationService } from '../orientation.services';

class MockOrientationService {
  dummy;
  mockPrograms = require('../mock.json');

  getOrientationProgramById(programId: number, search: any) {
    this.dummy = [search];
    const program = this.mockPrograms.filter((item) => item.id === programId);

    return Observable.of(program);
  }
}

describe('OrientationInfoComponent', () => {
  let spy;
  let component: OrientationInfoComponent;
  let service: OrientationService;
  let fixture: ComponentFixture<OrientationInfoComponent>;

  const mockProgram = Observable.of([{
    'id': 84,
    'name': 'new list with no duplicates',
    'description': 'fdsafsd',
    'events': 12,
    'members': 10,
    'start': '1557637200',
    'end': '1557637200',
    'is_membership': 0
  }]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrientationInfoComponent ],
      providers: [
        CPSession,
        { provide: OrientationService, useClass: MockOrientationService },
        { provide: ActivatedRoute,
          useValue: {
            parent: {
              snapshot: {
                params: Observable.of({orientationId: 1}),
              },
            },
          }
        }
      ]
    }) .overrideComponent(OrientationInfoComponent, {
      set: {
        template: '<div>No Template</div>'
      }
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(OrientationInfoComponent);
      component = fixture.componentInstance;
      service = TestBed.get(OrientationService);
    });
  }));

  it('Should fetch orientation program by Id', () => {
    spy = spyOn(component, 'fetch');
    expect(spy).not.toHaveBeenCalled();
    component.fetch();
    expect(spy).toHaveBeenCalled();
    expect(service.getOrientationProgramById(84, null)).toEqual(mockProgram);
  });

});
