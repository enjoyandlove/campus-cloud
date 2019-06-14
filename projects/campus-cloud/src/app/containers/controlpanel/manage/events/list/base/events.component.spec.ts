import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { of as observableOf } from 'rxjs';
import { Router } from '@angular/router';

import { CPSession } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';
import { EventsModule } from '../../events.module';
import { EventsService } from '../../events.service';
import { EventsComponent } from './events.component';
import { mockSchool } from '@campus-cloud/session/mock/school';

class MockService {
  dummy;

  getEvents(startRage: number, endRage: number, search: any) {
    this.dummy = [startRage, endRage, search];

    return observableOf({});
  }
}
class RouterMock {
  navigate() {}
}

describe('EventsListComponent', () => {
  let spy;
  let search;
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;

  const mockEvents = require('./mockEvents.json');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, EventsModule],
      providers: [
        CPSession,
        CPI18nService,
        { provide: Router, useClass: RouterMock },
        { provide: EventsService, useClass: MockService }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EventsComponent);

        component = fixture.componentInstance;
        component.session.g.set('school', mockSchool);
        component.eventState = Object.assign({}, component.eventState, {
          end: 1618108386,
          start: 1523479847,
          sort_field: 'start',
          exclude_current: null,
          attendance_only: 0
        });

        search = new HttpParams()
          .append('start', component.eventState.start.toString())
          .append('end', component.eventState.end.toString())
          .append('school_id', component.session.g.get('school').id.toString())
          .append('search_str', component.eventState.search_str)
          .append('attendance_only', component.eventState.attendance_only.toString())
          .append('sort_field', component.eventState.sort_field)
          .append('sort_direction', component.eventState.sort_direction);

        if (component.orientationId) {
          search = search.append('calendar_id', component.orientationId.toString());
        }
        if (component.eventState.exclude_current) {
          search = search.append(
            'exclude_current',
            component.eventState.exclude_current.toString()
          );
        }
      });
  }));

  it('should fetch list of orientation events', fakeAsync(() => {
    spy = spyOn(component.service, 'getEvents').and.returnValue(observableOf(mockEvents));
    component.buildHeaders();

    tick();
    expect(spy.calls.count()).toBe(1);
    expect(component.eventState.events.length).toEqual(mockEvents.length);
    expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
  }));
});
