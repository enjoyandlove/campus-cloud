import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpParams } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';

import { EventsModule } from '../events.module';
import { EventsService } from '../events.service';
import { provideMockStore } from '@ngrx/store/testing';
import { mockEvent, MockEventService } from './../tests';
import { MODAL_DATA } from '@campus-cloud/shared/services';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { EventsDeleteComponent } from './events-delete.component';
import { CPDeleteModalComponent } from '@campus-cloud/shared/components';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { OrientationEventsService } from '../../orientation/events/orientation.events.service';

describe('EventDeleteComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, EventsModule, RouterTestingModule],
        providers: [
          provideMockStore(),
          { provide: EventsService, useClass: MockEventService },
          { provide: OrientationEventsService, useClass: MockEventService },
          {
            provide: MODAL_DATA,
            useValue: {
              onClose: () => {},
              onAction: () => {},
              data: mockEvent,
              orientation_id: 123
            }
          }
        ]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let spy;
  let search;
  let eventId;
  let de: DebugElement;
  let component: EventsDeleteComponent;
  let deleteModal: CPDeleteModalComponent;
  let fixture: ComponentFixture<EventsDeleteComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EventsDeleteComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    deleteModal = de.query(By.directive(CPDeleteModalComponent)).componentInstance;

    component.modal.data.event = mockEvent;

    eventId = component.modal.data.event.id;
    component.session.g.set('school', mockSchool);
  }));

  it('should call onDelete on cp-delete-modal deleteClick', () => {
    spyOn(component, 'onDelete');
    deleteModal.deleteClick.emit();

    expect(component.onDelete).toHaveBeenCalled();
  });

  it('should call onClose on cp-delete-modal cancelClick', () => {
    spyOn(component, 'onClose');
    deleteModal.cancelClick.emit();

    expect(component.onClose).toHaveBeenCalled();
  });

  it('should delete orientation event', () => {
    component.modal.data.orientation_id = 10045;
    spy = spyOn(component.service, 'deleteEventById').and.returnValue(of({}));
    search = new HttpParams()
      .append('school_id', component.session.g.get('school').id)
      .append('calendar_id', component.modal.data.orientation_id.toString());

    component.onDelete();
    expect(spy).toHaveBeenCalledWith(eventId, search);
    expect(spy.calls.count()).toBe(1);
  });
});
