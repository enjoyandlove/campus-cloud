import mockSession from './../../../../../session/mock/session';
import { Observable } from 'rxjs/Observable';
import 'rxjs';
/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/Http';

// import { By } from '@angular/platform-browser';
// import { DebugElement } from '@angular/core';

import { headerReducer } from '../../../../../reducers';
import { StudentsService } from './../students.service';
import { CPSession } from './../../../../../session/index';
import { SharedModule } from './../../../../../shared/shared.module';
import { StudentsProfileComponent } from './students-profile.component';

class MockHttp {

}

class MockStudentsService {
  getStudentById() {
    return Observable.of(
      {
        'firstname': 'Mock',
        'last_event': 0,
        'lastname': 'User',
        'email': 'mock@user.com',
        'last_service': 0,
        'avatar_url': 'http://mock.image.jpg',
        'avatar': 7,
        'services': 0,
        'events': 0,
        'id': 94667
      }
    );
  }

  getEngagements() {
    return Observable.of(
      [{
        'related_id': 168428,
        'user_feedback_text': 'safety',
        'name': 'Family Day Weekend',
        'user_rating_percent': 100,
        'checkin_id': 1,
        'time_epoch': 1467907902,
        'rating_scale_maximum': 5,
        'type': 'event',
        'feedback_time_epoch': 1469024496
      }, {
        'related_id': 1483825,
        'user_feedback_text': '',
        'name': 'Hey SEB THIS IS IT ',
        'user_rating_percent': 20,
        'checkin_id': 121,
        'time_epoch': 1471644492,
        'rating_scale_maximum': 5,
        'type': 'event',
        'feedback_time_epoch': 1471877917
      }]
    );
  }
}

describe('StudentsProfileComponent', () => {
  let session: CPSession;
  let store: Store<any>;
  let service;
  let fixture: ComponentFixture<StudentsProfileComponent>;
  let comp: StudentsProfileComponent;
  // let el;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StudentsProfileComponent
      ],
      imports: [
        SharedModule,
        StoreModule.provideStore({
          HEADER: headerReducer
        })
      ],
      providers: [
        CPSession,
        // StudentsService,
        { provide: CPSession, useValue: mockSession },
        { provide: Http, useClass: MockHttp },
        { provide: StudentsService, useClass: MockStudentsService },
        {
          provide: ActivatedRoute, useValue: {
            'snapshot': {
              'params': Observable.of({ studentId: 1 })
            }
          }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.get(Store);
    session = TestBed.get(CPSession);
    service = TestBed.get(StudentsService);

    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(StudentsProfileComponent);
    comp = fixture.componentInstance;
  });

  it('Should get student data', (done) => {
    console.log(comp.student);
    const spy = spyOn(service, 'getStudentById').and.returnValue(Observable.of('Sopa'));

    fixture.detectChanges();
    spy.calls.mostRecent().returnValue.subscribe(() => {
      fixture.detectChanges();
      console.log(comp.student);
      done();
    })

    // spy.calls.mostRecent().returnValue.then(() => {
    //   fixture.detectChanges();
    //   console.log(comp);
    //   done();
    // })
  })

});

