import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { EventsModule } from '../events.module';
import { EventsService } from '../events.service';
import { CPSession } from '../../../../../session';
import { CPI18nService } from '../../../../../shared/services';
import { mockSchool } from '../../../../../session/mock/school';
import { EventsDeleteComponent } from './events-delete.component';

class MockService {
  dummy;

  deleteEventById(id: number, search: any) {
    this.dummy = [id, search];

    return Observable.of({});
  }
}

describe('EventDeleteComponent', () => {
  let spy;
  let search;
  let eventId;
  let service: EventsService;
  let component: EventsDeleteComponent;
  let fixture: ComponentFixture<EventsDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        EventsModule,
      ],
      providers: [
        CPSession,
        CPI18nService,
        { provide: EventsService, useClass: MockService },
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EventsDeleteComponent);
        service = TestBed.get(EventsService);

        component = fixture.componentInstance;
        component.event = {
          id: 1001
        };

        eventId = component.event.id;
        component.session.g.set('school', mockSchool);

        search = new URLSearchParams();
        if (component.orientationId) {
          search.append('school_id', component.session.g.get('school').id);
          search.append('calendar_id', component.orientationId.toString());
        }
      });
  }));

  it('buttonData should have "Delete" label & "Danger class"', () => {
    component.ngOnInit();

    expect(component.buttonData.text).toEqual('Delete');
    expect(component.buttonData.class).toEqual('danger');
  });

  it('should delete orientation event', () => {
    spy = spyOn(component.service, 'deleteEventById').and.returnValue(Observable.of({}));

    component.onDelete();
    expect(component.buttonData.disabled).toBeFalsy();
    expect(spy).toHaveBeenCalledWith(eventId, search);
    expect(spy.calls.count()).toBe(1);
  });
});
