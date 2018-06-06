import { HttpParams } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf } from 'rxjs';
import { EventsDeleteComponent } from './events-delete.component';
import { CPSession } from '../../../../../session';
import { mockSchool } from '../../../../../session/mock/school';
import { CPI18nService } from '../../../../../shared/services';
import { EventsModule } from '../events.module';
import { EventsService } from '../events.service';

class MockService {
  dummy;

  deleteEventById(id: number, search: any) {
    this.dummy = [id, search];

    return observableOf({});
  }
}

describe('EventDeleteComponent', () => {
  let spy;
  let search;
  let eventId;
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
    spy = spyOn(component.service, 'deleteEventById').and.returnValue(observableOf({}));
    search = new HttpParams()
      .append('school_id', component.session.g.get('school').id)
      .append('calendar_id', component.orientationId.toString());

    component.onDelete();
    expect(component.buttonData.disabled).toBeFalsy();
    expect(spy).toHaveBeenCalledWith(eventId, search);
    expect(spy.calls.count()).toBe(1);
  });
});
