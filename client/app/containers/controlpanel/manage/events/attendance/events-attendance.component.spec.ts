import { HttpParams } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';
import { EventsAttendanceComponent } from './events-attendance.component';
import { reducers } from '../../../../../reducers';
import { CPSession } from '../../../../../session';
import { mockSchool } from '../../../../../session/mock/school';
import { CPI18nService } from '../../../../../shared/services';
import { EventsModule } from '../events.module';
import { EventsService } from '../events.service';
import { EventUtilService } from '../events.utils.service';

class MockService {
  dummy;

  getEventById(id: number, search: any) {
    this.dummy = [id, search];

    return observableOf({});
  }
}

describe('EventAttendanceComponent', () => {
  let spy;
  let component: EventsAttendanceComponent;
  let fixture: ComponentFixture<EventsAttendanceComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          EventsModule,
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
          component.session.g.set('school', mockSchool);
        });
    })
  );

  it('HttpParams does not include calendar_id or school_id', () => {
    spyOn(component, 'buildHeader');
    spy = spyOn(component.service, 'getEventById').and.returnValue(observableOf({}));

    component.fetch();
    const search = new HttpParams();
    expect(spy).toHaveBeenCalledWith(component.eventId, search);
    expect(spy.calls.count()).toBe(1);
  });

  it('HttpParams includes calendar_id and school_id', () => {
    component.orientationId = 5425;
    spyOn(component, 'buildHeader');
    spy = spyOn(component.service, 'getEventById').and.returnValue(observableOf({}));

    component.fetch();
    const search = new HttpParams()
      .append('school_id', component.session.g.get('school').id)
      .append('calendar_id', component.orientationId.toString());
    expect(spy).toHaveBeenCalledWith(component.eventId, search);
    expect(spy.calls.count()).toBe(1);
  });
});
