import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpModule, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { EventsModule } from '../../../events.module';
import { EventsService } from '../../../events.service';
import { CPSession } from '../../../../../../../session';
import { CPI18nService } from '../../../../../../../shared/services';
import { mockSchool } from '../../../../../../../session/mock/school';
import { AttendancePastComponent } from './past.component';

class MockService {
  dummy;

  getEventAttendanceByEventId(start: number, end: number, search: any) {
    this.dummy = [start, end, search];

    return Observable.of({});
  }
}

describe('AttendancePastComponent', () => {
  let spy;
  let search;
  let service: EventsService;
  let component: AttendancePastComponent;
  let fixture: ComponentFixture<AttendancePastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        EventsModule,
      ],
      providers: [
        CPSession,
        CPI18nService,
        { provide: EventsService, useClass: MockService },
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AttendancePastComponent);
        service = TestBed.get(EventsService);

        component = fixture.componentInstance;
        component.isOrientation = true;
        component.orientationId = 1001;
        component.session.g.set('school', mockSchool);
        component.event = {
          id: 5125
        };

        search = new URLSearchParams();
        search.append('event_id', component.event.id);
        search.append('sort_field', component.state.sort_field);
        search.append('sort_direction', component.state.sort_direction);
        search.append('search_text', component.state.search_text);

        if (component.orientationId) {
          search.append('school_id', component.session.g.get('school').id);
          search.append('calendar_id', component.orientationId.toString());
        }
      });
  }));

  it('should fetch event attendees by event Id', () => {
    spy = spyOn(component.service, 'getEventAttendanceByEventId')
      .and.returnValue(Observable.of({}));
    component.fetch();

    expect(spy.calls.count()).toBe(1);
    expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
  });
});
