import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { of as observableOf } from 'rxjs';

import { EventsModule } from '../events.module';
import { EventsService } from '../events.service';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { EventUtilService } from '../events.utils.service';
import { EventsInfoComponent } from './events-info.component';
import { mockSchool } from '@campus-cloud/session/mock/school';

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
  let component: EventsInfoComponent;
  let fixture: ComponentFixture<EventsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule, EventsModule, HttpClientModule],
      providers: [
        EventUtilService,
        provideMockStore(),
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

        component = fixture.componentInstance;
        component.eventId = 15845;
        component.session.g.set('school', mockSchool);
      });
  }));

  it('should fetch orientation event by Id', fakeAsync(() => {
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
  }));
});
