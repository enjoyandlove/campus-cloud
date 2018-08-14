import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';
import { of as observableOf } from 'rxjs';

import { CPSession } from './../../../../../session';
import { DashboardModule } from '../../dashboard.module';
import { DashboardService } from '../../dashboard.service';
import { mockUser } from '../../../../../session/mock/user';
import { CP_PRIVILEGES_MAP } from '../../../../../shared/constants';
import { DashboardUtilsService } from '../../dashboard.utils.service';
import { DashboardTopOrientationComponent } from './dashboard-top-orientation.component';

class MockDashboardService {
  dummy;

  getTopOrientation(search: any) {
    this.dummy = [search];

    return observableOf({});
  }
}

describe('DashboardTopOrientationComponent', () => {
  let spy;
  let search;
  let comp: DashboardTopOrientationComponent;
  let fixture: ComponentFixture<DashboardTopOrientationComponent>;

  const mockProgram = observableOf({
    top_events: [
      {
        calendar_id: 84,
        calendar_name: 'Hello World!',
        num_of_feedbacks: 20,
        num_of_attendees: 30,
        average_of_feedbacks: 50
      }
    ]
  });

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [DashboardModule],
        providers: [
          CPSession,
          DashboardUtilsService,
          { provide: DashboardService, useClass: MockDashboardService }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(DashboardTopOrientationComponent);
          comp = fixture.componentInstance;
          comp.session.g.set('user', mockUser);
          comp.session.g.set('school', { id: 157 });
          comp._dates = {
            end: 1515625016,
            start: 7845125016
          };

          search = new HttpParams()
            .append('sort_by', 'engagements')
            .append('end', comp._dates.end.toString())
            .append('start', comp._dates.start.toString())
            .append('school_id', comp.session.g.get('school').id.toString());

          spy = spyOn(comp.service, 'getTopOrientation').and.returnValue(mockProgram);
        });
    })
  );

  it(
    'should fetch top orientation programs',
    fakeAsync(() => {
      const resourceUrl = '/manage/orientation/84/events';

      comp.ngOnInit();
      tick();

      expect(spy).toHaveBeenCalledWith(search);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(comp.items.length).toEqual(1);
      expect(comp.items[0].resourceUrl).not.toBeNull();
      expect(comp.items[0].resourceUrl).toBe(resourceUrl);
    })
  );

  it('should have orientation privileges', () => {
    comp.ngOnInit();
    expect(comp.canViewOrientation).toBeTruthy();

    const newMockUser = {
      school_level_privileges: {
        157: {
          [CP_PRIVILEGES_MAP.orientation]: {
            r: false,
            w: false
          }
        }
      }
    };

    comp.session.g.set('user', newMockUser);

    comp.ngOnInit();
    expect(comp.canViewOrientation).toBeFalsy();
  });
});
