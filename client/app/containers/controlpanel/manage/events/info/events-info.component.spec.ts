import { async, fakeAsync, tick, TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { StoreModule } from '@ngrx/store';

import { EventsModule } from '../events.module';
import { EventsService } from '../events.service';
import { CPSession } from '../../../../../session';
import { EventUtilService } from '../events.utils.service';
import { EventsInfoComponent } from './events-info.component';
import { CPI18nService } from '../../../../../shared/services';
import { mockSchool } from '../../../../../session/mock/school';
import { headerReducer, snackBarReducer } from '../../../../../reducers';

class MockService {
  dummy;

  getEventById(eventId: number, search: any) {
    this.dummy = [eventId, search];

    return Observable.of({});
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
                params: Observable.of({ eventId: 15845 })
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

          search = new HttpParams();
        });
    })
  );

  it(
    'should fetch orientation event by Id',
    fakeAsync(() => {
      component.orientationId = 1001;
      search.append('school_id', component.session.g.get('school').id);
      search.append('calendar_id', component.orientationId.toString());

      spyOn(component, 'buildHeader');
      spy = spyOn(component.service, 'getEventById').and.returnValue(Observable.of({}));
      component.fetch();

      tick();
      expect(spy.calls.count()).toBe(1);
      expect(spy).toHaveBeenCalledWith(component.eventId, search);
    })
  );
});
