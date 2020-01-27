import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { EventsModule } from '../events.module';
import { RootStoreModule } from '@campus-cloud/store';
import { EventUtilService } from '../events.utils.service';
import { EventsExcelComponent } from './events-excel.component';
import { filledForm as mockEvent } from '@controlpanel/manage/events/tests';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { AdminService, StoreService, FileUploadService } from '@campus-cloud/shared/services';

describe('EventsExcelComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          CPTestModule,
          EventsModule,
          RootStoreModule,
          HttpClientModule,
          RouterTestingModule
        ],
        providers: [AdminService, StoreService, EventUtilService, FileUploadService]
      });
    })()
      .then(done)
      .catch(done.fail);
  });

  let event;
  let component: EventsExcelComponent;
  let fixture: ComponentFixture<EventsExcelComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsExcelComponent);
    component = fixture.componentInstance;
    event = component.buildEvent(mockEvent);
  });

  describe('BUILD EVENT', () => {
    it('should set store ID', () => {
      component.storeId = 123;
      event = component.buildEvent(mockEvent);

      expect(event.store_id).toBe(component.storeId);
    });

    it('should set club ID', () => {
      component.clubId = 123;
      event = component.buildEvent(mockEvent);

      expect(event.store_id).toBe(component.clubId);
    });

    it('should set default store ID', () => {
      expect(event.store_id).toBe(mockEvent.store_id);
    });

    it('should set attendance manager email', () => {
      expect(event.attendance_manager_email).toBeUndefined();

      const mockEventData = {
        ...mockEvent,
        event_attendance: 1,
        attendance_manager_email: 'hello@oohlalamobile.com'
      };

      event = component.buildEvent(mockEventData);
      expect(event.attendance_manager_email).toBe(mockEventData.attendance_manager_email);
    });

    it('should set Feedback and Manager ID if attendance enabled', () => {
      expect(event.event_feedback).toBeUndefined();
      expect(event.event_manager_id).toBeUndefined();

      const mockEventData = {
        ...mockEvent,
        event_attendance: 1
      };

      event = component.buildEvent(mockEventData);
      expect(event.event_feedback).toBe(mockEvent.event_feedback);
      expect(event.event_manager_id).toBe(mockEvent.event_manager_id);
    });
  });

  it('should build event without assessment manager', () => {
    const event: any = component.buildEvent(mockEvent);

    expect(event.attendance_manager_email).toBeUndefined();
  });
});
