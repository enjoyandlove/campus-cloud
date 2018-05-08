import { async, fakeAsync, tick, TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { EventsModule } from '../../events.module';
import { EventsComponent } from './events.component';
import { EventsService } from '../../events.service';
import { CPSession } from '../../../../../../session';
import { CPI18nService } from '../../../../../../shared/services';
import { mockSchool } from '../../../../../../session/mock/school';

class MockService {
  dummy;

  getEvents(startRage: number, endRage: number, search: any) {
    this.dummy = [startRage, endRage, search];

    return Observable.of(Observable.of({}));
  }
}
class RouterMock {
  navigate() {}
}

describe('EventsListComponent', () => {
  let spy;
  let search;
  let service: EventsService;
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;

  const mockEvents = require('./mockEvents.json');

  beforeEach(
    async(() => {
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
          service = TestBed.get(EventsService);

          component = fixture.componentInstance;
          component.session.g.set('school', mockSchool);
          component.state = Object.assign({}, component.state, {
            end: 1618108386,
            start: 1523479847,
            sort_field: 'start',
            exclude_current: null,
            attendance_only: 0
          });

          search = new HttpParams();
          search.append('start', component.state.start.toString());
          search.append('end', component.state.end.toString());
          search.append('calendar_id', component.orientationId);
          search.append('school_id', component.session.g.get('school').id.toString());
          search.append('search_str', component.state.search_str);
          search.append('exclude_current', component.state.exclude_current);
          search.append('attendance_only', component.state.attendance_only.toString());
          search.append('sort_field', component.state.sort_field);
          search.append('sort_direction', component.state.sort_direction);
        });
    })
  );

  it(
    'should fetch list of orientation events',
    fakeAsync(() => {
      spy = spyOn(component.service, 'getEvents').and.returnValue(Observable.of(mockEvents));
      component.buildHeaders();

      tick();
      expect(spy.calls.count()).toBe(1);
      expect(component.state.events.length).toEqual(mockEvents.length);
      expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
    })
  );
});
