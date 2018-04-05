import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { URLSearchParams } from '@angular/http';

import { CPSession } from './../../../../../session';
import { OrientationService } from '../orientation.services';
import { mockSchool } from '../../../../../session/mock/school';
import { OrientationInfoComponent } from './orientation-info.component';
import { OrientationDetailsModule } from '../details/orientation-details.module';

class MockOrientationService {
  dummy;

  getProgramById(programId: number, search: any) {
    this.dummy = [programId, search];

    return Observable.of({});
  }
}

describe('OrientationInfoComponent', () => {
  let spy;
  let search;
  let component: OrientationInfoComponent;
  let service: OrientationService;
  let fixture: ComponentFixture<OrientationInfoComponent>;

  const mockProgram = Observable.of([{
    'id': 84,
    'name': 'Hello World!',
    'description': 'This is description',
    'events': 12,
    'members': 10,
    'start': '1557637200',
    'end': '1557637200',
    'has_membership': 0
  }]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [OrientationDetailsModule],
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
      ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(OrientationInfoComponent);
      component = fixture.componentInstance;
      service = TestBed.get(OrientationService);
      search = new URLSearchParams();

      component.loading = false;
      component.orientationId = 84;
      component.session.g.set('school', mockSchool);
      search.append('school_id', component.session.g.get('school').id.toString());
    });
  }));

  it('should fetch orientation program by Id', () => {
    spy = spyOn(component.service, 'getProgramById').and.returnValue(mockProgram);
    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith(component.orientationId, search);
    expect(spy.calls.count()).toBe(1);
  });

});
