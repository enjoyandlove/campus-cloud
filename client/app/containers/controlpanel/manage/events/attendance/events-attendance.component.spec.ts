import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { URLSearchParams } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { StoreModule } from '@ngrx/store';

import { EventsModule } from '../events.module';
import { EventsService } from '../events.service';
import { CPSession } from '../../../../../session';
import { EventUtilService } from '../events.utils.service';
import { CPI18nService } from '../../../../../shared/services';
import { mockSchool } from '../../../../../session/mock/school';
import { headerReducer, snackBarReducer } from '../../../../../reducers';
import { EventsAttendanceComponent } from './events-attendance.component';

class MockService {
  dummy;

  getEventById(id: number, search: any) {
    this.dummy = [id, search];

    return Observable.of({});
  }
}

describe('EventAttendanceComponent', () => {
  let spy;
  let search;
  let service: EventsService;
  let component: EventsAttendanceComponent;
  let fixture: ComponentFixture<EventsAttendanceComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          EventsModule,
          StoreModule.forRoot({
            HEADER: headerReducer,
            SNACKBAR: snackBarReducer
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
                params: Observable.of({ eventId: 1001 })
              }
            }
          }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(EventsAttendanceComponent);
          service = TestBed.get(EventsService);

          component = fixture.componentInstance;
          component.eventId = 1001;
          component.session.g.set('school', mockSchool);

          search = new URLSearchParams();
        });
    })
  );

  it('URLSearchparams does not include calendar_id or school_id', () => {
    spyOn(component, 'buildHeader');
    spy = spyOn(component.service, 'getEventById').and.returnValue(Observable.of({}));

    component.fetch();
    expect(spy).toHaveBeenCalledWith(component.eventId, search);
    expect(spy.calls.count()).toBe(1);
  });

  it('URLSearchparams includes calendar_id and school_id', () => {
    component.orientationId = 5425;
    spyOn(component, 'buildHeader');
    spy = spyOn(component.service, 'getEventById').and.returnValue(Observable.of({}));

    component.fetch();
    search.append('school_id', component.session.g.get('school').id);
    search.append('calendar_id', component.orientationId.toString());
    expect(spy).toHaveBeenCalledWith(component.eventId, search);
    expect(spy.calls.count()).toBe(1);
  });
});
