import { HttpClientModule, HttpParams } from '@angular/common/http';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';
import { EventsInfoComponent } from './events-info.component';
import { headerReducer, snackBarReducer } from '../../../../../reducers';
import { CPSession } from '../../../../../session';
import { mockSchool } from '../../../../../session/mock/school';
import { CPI18nService } from '../../../../../shared/services';
import { EventsModule } from '../events.module';
import { EventsService } from '../events.service';
import { EventUtilService } from '../events.utils.service';

class MockService {
  dummy;

  getEventById(eventId: number, search: any) {
    this.dummy = [eventId, search];

    return observableOf({});
  }
}

class RouterMock {
  navigate() {}
}

describe('EventInfoComponent', () => {
  let spy;
  let search;
  let service: EventsService;
  let component: EventsInfoComponent;
  let fixture: ComponentFixture<EventsInfoComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
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
          { provide: Router, useClass: RouterMock },
          { provide: EventsService, useClass: MockService },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                params: observableOf({ eventId: 15845 })
              }
            }
          }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(EventsInfoComponent);
          service = TestBed.get(EventsService);

          component = fixture.componentInstance;
          component.eventId = 15845;
          component.session.g.set('school', mockSchool);
        });
    })
  );

  it(
    'should fetch orientation event by Id',
    fakeAsync(() => {
      component.orientationId = 1001;
      search = new HttpParams()
        .append('school_id', component.session.g.get('school').id)
        .append('calendar_id', component.orientationId.toString());

      spyOn(component, 'buildHeader');
      spy = spyOn(component.service, 'getEventById').and.returnValue(observableOf({}));
      component.fetch();

      tick();
      expect(spy.calls.count()).toBe(1);
      expect(spy).toHaveBeenCalledWith(component.eventId, search);
    })
  );
});
