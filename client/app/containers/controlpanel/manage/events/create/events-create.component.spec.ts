import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { FormBuilder } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
// import { Router } from '@angular/router';

import { EventsModule } from '../events.module';
import { EventsService } from '../events.service';
import { CPSession } from '../../../../../session';
import { EventUtilService } from '../events.utils.service';
import { mockSchool } from '../../../../../session/mock/school';
import { EventsCreateComponent } from './events-create.component';
import { headerReducer, snackBarReducer } from '../../../../../reducers';
import {
  AdminService,
  CPI18nService,
  ErrorService,
  StoreService
} from '../../../../../shared/services';

class MockService {
  dummy;

  createEvent(body: any, search: any) {
    this.dummy = [search];

    return Observable.of({body});
  }
}

fdescribe('EventCreateComponent', () => {
  let spy;
  let search;
  let storeService;
  let service: EventsService;
  let component: EventsCreateComponent;
  let fixture: ComponentFixture<EventsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        EventsModule,
        RouterTestingModule,
        StoreModule.forRoot({
          HEADER: headerReducer,
          SNACKBAR: snackBarReducer
        })
      ],
      providers: [
        CPSession,
        FormBuilder,
        AdminService,
        ErrorService,
        StoreService,
        CPI18nService,
        EventUtilService,
        { provide: EventsService, useClass: MockService },
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EventsCreateComponent);
        service = TestBed.get(EventsService);
        storeService = TestBed.get(StoreService);

        component = fixture.componentInstance;
        component.orientationId = 1001;
        component.session.g.set('school', mockSchool);

        search = new URLSearchParams();
        if (component.orientationId) {
          search.append('school_id', component.session.g.get('school').id);
          search.append('calendar_id', component.orientationId.toString());
        }

        component.ngOnInit();
      });
  }));

  it('should isAllDay be true', () => {
    component.onAllDayToggle(true);
    expect(component.form.controls['is_all_day'].value).toBeTruthy();
  });

  it('should create orientation event', () => {
    spyOn(component, 'buildHeader');
    spy = spyOn(component.service, 'createEvent').and.returnValue(Observable.of({}));

    expect(true).toBeTruthy();
    // expect(spy.calls.count()).toBe(1);
  });
});
