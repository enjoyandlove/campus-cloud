import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [EventsModule, RouterTestingModule],
        providers: [CPSession, CPI18nService, { provide: EventsService, useClass: MockService }]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(EventsDeleteComponent);
          service = TestBed.get(EventsService);

          component = fixture.componentInstance;
          component.event = {
            id: 1001
          };

          eventId = component.event.id;
          component.session.g.set('school', mockSchool);
        });
    })
  );

  it('buttonData should have "Delete" label & "Danger class"', () => {
    component.ngOnInit();

    expect(component.buttonData.text).toEqual('Delete');
    expect(component.buttonData.class).toEqual('danger');
  });

  it('should delete orientation event', () => {
    component.orientationId = 10045;
    spy = spyOn(component.service, 'deleteEventById').and.returnValue(Observable.of({}));
    search = new HttpParams()
      .append('school_id', component.session.g.get('school').id)
      .append('calendar_id', component.orientationId.toString());

    component.onDelete();
    expect(component.buttonData.disabled).toBeFalsy();
    expect(spy).toHaveBeenCalledWith(eventId, search);
    expect(spy.calls.count()).toBe(1);
  });
});
