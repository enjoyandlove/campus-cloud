import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, FormBuilder } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

import { EventsModule } from '../events.module';
import { EventsService } from '../events.service';
import { RootStoreModule } from '@campus-cloud/store';
import { EventUtilService } from '../events.utils.service';
import { EventsExcelComponent } from './events-excel.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { AdminService, StoreService, FileUploadService } from '@campus-cloud/shared/services';

class MockService {
  dummy;
  createEvent(events, search) {
    this.dummy = [events, search];

    return of({});
  }
}

const mockEvent: any = {
  title: 'title',
  store_id: 1,
  description: 'description',
  end: 'end',
  room: 'room',
  start: 'start',
  location: 'location',
  poster_url: 'poster_url',
  has_checkout: true,
  poster_thumb_url: 'poster_thumb_url',
  event_attendance: 1
};

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
        providers: [
          AdminService,
          StoreService,
          EventUtilService,
          FileUploadService,
          {
            provide: EventsService,
            useClass: MockService
          }
        ]
      });
    })()
      .then(done)
      .catch(done.fail);
  });

  let component: EventsExcelComponent;
  let fixture: ComponentFixture<EventsExcelComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsExcelComponent);
    component = fixture.componentInstance;
  });

  it('should build event without assessment manager', () => {
    const event: any = component.buildEvent(mockEvent);

    expect(event.attendance_manager_email).toBeUndefined();
  });
});
