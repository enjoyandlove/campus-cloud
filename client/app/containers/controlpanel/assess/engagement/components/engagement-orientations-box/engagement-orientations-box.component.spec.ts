import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs/index';
import { of as observableOf } from 'rxjs';

import { CPSession } from './../../../../../../session';
import { EngagementModule } from '../../engagement.module';
import { EngagementService } from '../../engagement.service';
import { AssessUtilsService } from '../../../assess.utils.service';
import { CPTrackingService } from '../../../../../../shared/services';
import { EngagementUtilsService } from '../../engagement.utils.service';
import { CPI18nService } from '../../../../../../shared/services/i18n.service';
import { EngagementOrientationsBoxComponent } from './engagement-orientations-box.component';

class MockEngagementService {
  dummy;

  getOrientationData(search: any) {
    this.dummy = [search];

    return observableOf({});
  }
}

const mockFilterState = {
  engagement: {
    route_id: 'all',
    label: 'All Engagements',
    data: {
      type: null,
      value: 0,
      queryParam: 'scope'
    }
  },
  for: {
    route_id: 'all_students',
    label: 'All Students',
    listId: 1025,
    personaId: null
  },
  range: {
    route_id: 'last_week',
    label: 'Last 7 Days',
    payload: {
      metric: 'daily',
      range: {
        end: 1508180917,
        start: 1507608000
      }
    }
  }
};

describe('EngagementOrientationsBoxComponent', () => {
  let spy;
  let comp: EngagementOrientationsBoxComponent;
  let fixture: ComponentFixture<EngagementOrientationsBoxComponent>;

  const mockOrientation = observableOf(
    {
      avg_feedbacks: 50,
      total_events: 500,
      total_attendees: 25,
      total_feedbacks: 75,
      total_events_with_attendance: 50,
      top_events: [{
        calendar_id: 84,
        calendar_name: 'Hello World!',
        num_of_feedbacks: 20,
        num_of_attendees: 30,
        average_of_feedbacks: 50,
      }]
    });

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [EngagementModule, RouterTestingModule],
        providers: [
          CPSession,
          CPI18nService,
          CPTrackingService,
          AssessUtilsService,
          EngagementUtilsService,
          { provide: EngagementService, useClass: MockEngagementService }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(EngagementOrientationsBoxComponent);
          comp = fixture.componentInstance;
          comp.session.g.set('school', { id: 157 });
          const filters$ = new BehaviorSubject(null);
          filters$.next(mockFilterState);
          comp.props = filters$;

          spyOn(comp, 'trackAmplitudeEvent');
        });
    })
  );

  it('onSortBy', () => {
    spyOn(comp, 'fetch');

    const sortBy = {
      action: 2,
      label: 'average'
    };

    comp.onSortBy(sortBy);

    expect(comp.isSorting).toBeTruthy();
    expect(comp.state.sortBy).toBe('average');
  });

  it('should fetch top orientation programs', fakeAsync(() => {
    spy = spyOn(comp.service, 'getOrientationData').and.returnValue(mockOrientation);
    comp.ngOnInit();
    tick();

    expect(comp.loading).toBeFalsy();
    expect(comp.isSorting).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(comp.stats.length).toEqual(5);
  }));
});
