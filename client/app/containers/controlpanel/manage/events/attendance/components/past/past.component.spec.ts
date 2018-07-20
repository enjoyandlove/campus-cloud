import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf } from 'rxjs';

import { EventsModule } from '../../../events.module';
import { EventsService } from '../../../events.service';
import { CPSession } from '../../../../../../../session';
import { AttendancePastComponent } from './past.component';
import { CPI18nService } from '../../../../../../../shared/services';
import { mockSchool } from '../../../../../../../session/mock/school';

class MockService {
  dummy;

  getEventAttendanceByEventId(start: number, end: number, search: any) {
    this.dummy = [start, end, search];

    return observableOf({});
  }
}

describe('AttendancePastComponent', () => {
  let spy;
  let search;
  let component: AttendancePastComponent;
  let fixture: ComponentFixture<AttendancePastComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, HttpClientModule, EventsModule],
        providers: [CPSession, CPI18nService, { provide: EventsService, useClass: MockService }]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(AttendancePastComponent);

          component = fixture.componentInstance;
          component.isLoading().subscribe((_) => (component.loading = false));
          component.session.g.set('school', mockSchool);
          component.event = {
            id: 5125
          };

          search = new HttpParams()
            .append('event_id', component.event.id)
            .append('sort_field', component.state.sort_field)
            .append('sort_direction', component.state.sort_direction)
            .append('search_text', component.state.search_text);
        });
    })
  );

  it('should fetch event attendees by event Id', () => {
    spy = spyOn(component.service, 'getEventAttendanceByEventId').and.returnValue(observableOf({}));

    component.fetch();

    expect(spy.calls.count()).toBe(1);
    expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
  });

  it('should fetch orientation event attendees by event Id', () => {
    spy = spyOn(component.service, 'getEventAttendanceByEventId').and.returnValue(observableOf({}));

    component.isOrientation = true;
    component.orientationId = 1001;
    const _search = search
      .append('school_id', component.session.g.get('school').id)
      .append('calendar_id', component.orientationId.toString());

    component.fetch();

    expect(spy.calls.count()).toBe(1);
    expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, _search);
  });
});
