import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of as observableOf } from 'rxjs';

import { CPSession } from './../../../../../session';
import { OrientationService } from '../orientation.services';
import { mockSchool } from '../../../../../session/mock/school';
import { CPTrackingService } from '../../../../../shared/services';
import { OrientationInfoComponent } from './orientation-info.component';
import { OrientationDetailsModule } from '../details/orientation-details.module';

class MockOrientationService {
  dummy;

  getProgramById(programId: number, search: any) {
    this.dummy = [programId, search];

    return observableOf({});
  }
}

describe('OrientationInfoComponent', () => {
  let spy;
  let search;
  let component: OrientationInfoComponent;
  let fixture: ComponentFixture<OrientationInfoComponent>;

  const mockProgram = observableOf([
    {
      id: 84,
      name: 'Hello World!',
      description: 'This is description',
      events: 12,
      members: 10,
      start: '1557637200',
      end: '1557637200',
      has_membership: 0
    }
  ]);

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [OrientationDetailsModule],
        providers: [
          CPSession,
          CPTrackingService,
          { provide: OrientationService, useClass: MockOrientationService },
          {
            provide: ActivatedRoute,
            useValue: {
              parent: {
                snapshot: {
                  params: observableOf({ orientationId: 1 })
                }
              }
            }
          }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(OrientationInfoComponent);
          component = fixture.componentInstance;
          component.loading = false;
          component.orientationId = 84;
          component.session.g.set('school', mockSchool);

          search = new HttpParams().append(
            'school_id',
            component.session.g.get('school').id.toString()
          );
        });
    })
  );

  it('should fetch orientation program by Id', () => {
    spy = spyOn(component.service, 'getProgramById').and.returnValue(mockProgram);
    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith(component.orientationId, search);
    expect(spy.calls.count()).toBe(1);
  });
});
