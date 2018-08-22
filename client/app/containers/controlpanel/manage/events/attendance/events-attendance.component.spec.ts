import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';

import { EventsModule } from '../events.module';
import { EventsService } from '../events.service';
import { reducers } from '../../../../../reducers';
import { CPSession } from '../../../../../session';
import { EventUtilService } from '../events.utils.service';
import { CPI18nService } from '../../../../../shared/services';
import { mockSchool } from '../../../../../session/mock/school';
import { EventsAttendanceComponent } from './events-attendance.component';

class MockService {
  dummy;

  getEventById(id: number, search: any) {
    this.dummy = [id, search];

    return observableOf({});
  }

  getEventAttendanceByEventId(startRange: number, endRange: number, search: any) {
    this.dummy = [startRange, endRange, search];

    return observableOf({});
  }
}

describe('EventAttendanceComponent', () => {
  let spy;
  let search;
  let spyAttendee;
  let component: EventsAttendanceComponent;
  let fixture: ComponentFixture<EventsAttendanceComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          EventsModule,
          RouterTestingModule,
          StoreModule.forRoot({
            HEADER: reducers.HEADER,
            SNACKBAR: reducers.SNACKBAR
          })
        ],
        providers: [
          CPSession,
          CPI18nService,
          EventUtilService,
          { provide: EventsService, useClass: MockService },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                params: observableOf({ eventId: 1001 })
              }
            }
          }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(EventsAttendanceComponent);

          component = fixture.componentInstance;
          component.eventId = 1001;
          component.loading = false;
          component.attendeesLoading = false;
          component.session.g.set('school', mockSchool);
          component.session.g.set('user', { school_level_privileges: {} });

          component.event = {
            id: 5125
          };

          search = new HttpParams()
            .append('event_id', component.event.id)
            .append('sort_field', component.state.sort_field)
            .append('search_text', component.state.search_text)
            .append('sort_direction', component.state.sort_direction);

          spyOn(component, 'buildHeader');
          spy = spyOn(component.service, 'getEventById').and.returnValue(observableOf({}));
          spyAttendee = spyOn(component.service, 'getEventAttendanceByEventId').and.returnValue(
            observableOf({})
          );
        });
    })
  );

  it('HttpParams does not include calendar_id or school_id', () => {
    console.log(component.session, component.session.g);
    component.fetch();
    const _search = new HttpParams();
    expect(spy).toHaveBeenCalledWith(component.eventId, _search);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('HttpParams includes calendar_id and school_id', () => {
    component.orientationId = 5425;

    const _search = new HttpParams()
      .append('school_id', component.session.g.get('school').id)
      .append('calendar_id', component.orientationId.toString());

    component.fetch();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(component.eventId, _search);
  });

  it('should fetch event attendees by event Id', () => {
    component.fetchAttendees();

    expect(spyAttendee).toHaveBeenCalledTimes(1);
    expect(spyAttendee).toHaveBeenCalledWith(component.startRange, component.endRange, search);
  });

  it('should fetch orientation event attendees by event Id', () => {
    component.isOrientation = true;
    component.orientationId = 1001;

    const _search = new HttpParams()
      .append('event_id', component.event.id)
      .append('sort_field', component.state.sort_field)
      .append('search_text', component.state.search_text)
      .append('sort_direction', component.state.sort_direction)
      .append('school_id', component.session.g.get('school').id)
      .append('calendar_id', component.orientationId.toString());

    component.fetchAttendees();

    expect(spyAttendee).toHaveBeenCalledTimes(1);
    expect(spyAttendee).toHaveBeenCalledWith(component.startRange, component.endRange, _search);
  });
});
