import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, FormBuilder } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

import { EventsModule } from '../events.module';
import { EventsService } from '../events.service';
import { CPSession } from '../../../../../session';
import { RootStoreModule } from '../../../../../store';
import { EventUtilService } from '../events.utils.service';
import { EventsExcelComponent } from './events-excel.component';
import { configureTestSuite } from '../../../../../shared/tests';
import {
  CPI18nService,
  AdminService,
  StoreService,
  FileUploadService
} from '../../../../../shared/services';

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
          EventsModule,
          RootStoreModule,
          HttpClientModule,
          RouterTestingModule
        ],
        providers: [
          CPSession,
          AdminService,
          StoreService,
          CPI18nService,
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

  xit('should create event onSubmit', () => {
    const fb = new FormBuilder();

    spyOn(component.service, 'createEvent').and.callThrough();
    component.form = fb.group({
      events: fb.array([])
    });
    component.onSubmit();

    expect(component.service.createEvent).toHaveBeenCalled();
  });

  it('should build event without assessment manager', () => {
    const event: any = component.buildEvent(mockEvent);

    expect(event.attendance_manager_email).toBeUndefined();
  });
});
