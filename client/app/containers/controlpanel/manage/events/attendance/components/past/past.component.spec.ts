import { async, TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DebugElement } from '@angular/core';

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

    return Observable.of({});
  }
}

describe('AttendancePastComponent', () => {
  let spy;
  let search;
  let service: EventsService;
  let component: AttendancePastComponent;
  let fixture: ComponentFixture<AttendancePastComponent>;

  const pastEvents = [
    {
      firstname: 'John',
      feedback_time: 1523276904,
      lastname: 'Paul',
      student_identifier: '',
      feedback_rating: 80,
      check_in_time: 1523276757,
      feedback_text: 'Good job man!',
      check_in_method: 1,
      email: 'jp@gmail.com'
    }
  ];

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule, EventsModule],
        providers: [CPSession, CPI18nService, { provide: EventsService, useClass: MockService }]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(AttendancePastComponent);
          service = TestBed.get(EventsService);

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

  it(
    'should not have RSVP column for orientation events',
    fakeAsync(() => {
      spy = spyOn(component.service, 'getEventAttendanceByEventId').and.returnValue(
        Observable.of(pastEvents)
      );

      component.isOrientation = true;
      component.orientationId = 1001;
      search.set('school_id', component.session.g.get('school').id);
      search.set('calendar_id', component.orientationId.toString());
      component.fetch();
      tick();

      fixture.detectChanges();

      const bannerDe: DebugElement = fixture.debugElement;
      const bannerEl: HTMLElement = bannerDe.nativeElement;
      const rsvp = bannerEl.querySelector('div.cp-table__header div.rsvp_column');
      expect(rsvp).toBeNull();
    })
  );

  it('should fetch event attendees by event Id', () => {
    spy = spyOn(component.service, 'getEventAttendanceByEventId').and.returnValue(
      Observable.of({})
    );

    component.fetch();

    expect(spy.calls.count()).toBe(1);
    expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
  });

  it('should fetch orientation event attendees by event Id', () => {
    spy = spyOn(component.service, 'getEventAttendanceByEventId').and.returnValue(
      Observable.of({})
    );

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
