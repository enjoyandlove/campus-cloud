import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpParams } from '@angular/common/http';
import { of as observableOf } from 'rxjs';

import { EventsModule } from '../../../../events.module';
import { AttendanceType } from '../../../../event.status';
import { EventsService } from '../../../../events.service';
import { CheckInDeleteComponent } from './delete.component';
import { CPSession } from '../../../../../../../../session';
import { mockSchool } from '../../../../../../../../session/mock';
import { CPI18nService } from '../../../../../../../../shared/services';

class MockService {
  dummy;
  deleteEventCheckInById(id: number, search: any) {
    this.dummy = [id, search];

    return observableOf({});
  }
}

describe('EventCheckInDeleteComponent', () => {
  let spy;
  let search;
  let component: CheckInDeleteComponent;
  let fixture: ComponentFixture<CheckInDeleteComponent>;

  const mockEvent = {
    id: 12543,
    has_checkout: AttendanceType.checkInCheckOut
  };

  const mockCheckIn = require('../mockCheckIn.json');

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [EventsModule, RouterTestingModule],
        providers: [
          CPSession,
          CPI18nService,
          { provide: EventsService, useClass: MockService }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(CheckInDeleteComponent);
          component = fixture.componentInstance;

          component.event = mockEvent;
          component.checkIn = mockCheckIn;
          component.session.g.set('school', mockSchool);
          search = new HttpParams().append('event_id', component.event.id.toString());
        });
    })
  );

  it('buttonData should have "Delete" label & "Danger class"', () => {
    component.ngOnInit();
    expect(component.buttonData.text).toEqual('Delete');
    expect(component.buttonData.class).toEqual('danger');
  });

  it('should delete check-in', () => {
    spyOn(component.deleted, 'emit');
    spyOn(component.teardown, 'emit');
    spy = spyOn(component.service, 'deleteEventCheckInById').and.returnValue(observableOf({}));

    component.onDelete();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(component.checkIn.id, search);

    expect(component.deleted.emit).toHaveBeenCalledTimes(1);
    expect(component.deleted.emit).toHaveBeenCalledWith(component.checkIn.id);

    expect(component.teardown.emit).toHaveBeenCalled();
    expect(component.teardown.emit).toHaveBeenCalledTimes(1);
  });

  it('should delete orientation check-in', () => {
    component.orientationId = 45884;

    spyOn(component.deleted, 'emit');
    spyOn(component.teardown, 'emit');
    spy = spyOn(component.service, 'deleteEventCheckInById').and.returnValue(observableOf({}));

    search = search
      .append('school_id', component.session.g.get('school').id)
      .append('calendar_id', component.orientationId.toString());

    component.onDelete();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(component.checkIn.id, search);

    expect(component.deleted.emit).toHaveBeenCalledTimes(1);
    expect(component.deleted.emit).toHaveBeenCalledWith(component.checkIn.id);

    expect(component.teardown.emit).toHaveBeenCalled();
    expect(component.teardown.emit).toHaveBeenCalledTimes(1);
  });
});
