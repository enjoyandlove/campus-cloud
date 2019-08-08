import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpParams } from '@angular/common/http';
import { of as observableOf } from 'rxjs';

import { mockCheckIn } from '../../../tests';
import { EventsModule } from '../../../events.module';
import { attendanceType } from '../../../event.status';
import { mockSchool } from '@campus-cloud/session/mock';
import { EventsService } from '../../../events.service';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { CheckInDeleteComponent } from './delete.component';

class MockService {
  dummy;
  deleteCheckInById(id: number, search: any) {
    this.dummy = [id, search];

    return observableOf({});
  }

  deleteOrientationCheckInById(id: number, search: any) {
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
    has_checkout: attendanceType.checkInCheckOut
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [EventsModule, RouterTestingModule, CPTestModule],
      providers: [provideMockStore(), { provide: EventsService, useClass: MockService }]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CheckInDeleteComponent);
        component = fixture.componentInstance;

        component.data = {
          ...component.data,
          ...mockEvent
        };
        component.checkIn = mockCheckIn;
        component.session.g.set('school', mockSchool);
        search = new HttpParams().append('event_id', component.data.id.toString());
      });
  }));

  it('should delete check-in', () => {
    spyOn(component.deleted, 'emit');
    spyOn(component.teardown, 'emit');
    spy = spyOn(component.service, 'deleteCheckInById').and.returnValue(observableOf({}));

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
    spy = spyOn(component.service, 'deleteCheckInById').and.returnValue(observableOf({}));

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
