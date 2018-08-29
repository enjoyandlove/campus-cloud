import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/index';
import { StoreModule } from '@ngrx/store';

import { EventsModule } from '../../../events.module';
import { CheckInMethod } from '../../../event.status';
import { CPSession } from '../../../../../../../session';
import { reducers } from '../../../../../../../reducers';
import { mockUser } from '../../../../../../../session/mock';
import { EventUtilService } from '../../../events.utils.service';
import { CPI18nService } from '../../../../../../../shared/services';
import { mockSchool } from '../../../../../../../session/mock/school';
import { EventsAttendanceComponent } from '../../events-attendance.component';
import { EventsAttendanceActionBoxComponent } from './events-attendance-action-box.component';

const mockEvent = require('../../../list/base/mockEvents.json');

fdescribe('EventAttendanceActionBoxComponent', () => {
  let updateQr = new BehaviorSubject(null);
  let component: EventsAttendanceActionBoxComponent;
  let fixture: ComponentFixture<EventsAttendanceActionBoxComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          EventsModule,
          HttpClientModule,
          RouterTestingModule,
          StoreModule.forRoot({
            HEADER: reducers.HEADER,
            SNACKBAR: reducers.SNACKBAR
          })
        ],
        providers: [
          CPSession,
          CPI18nService,
          EventUtilService,
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(EventsAttendanceComponent);

          component = fixture.componentInstance;
          component.event = mockEvent[0];
          component.session.g.set('user', mockUser);
          component.session.g.set('school', mockSchool);
        });
    })
  );

  it('updateQrCode', () => {
    const qrCodes = [CheckInMethod.app, CheckInMethod.web, CheckInMethod.webQr];

    // const hasQrLabel = component.cpI18n.translate('t_events_assessment_disable_qr_check_in');

    updateQr.next(qrCodes);

    component.updateQrCode = updateQr;

    component.ngOnInit();

    console.log(component.hasQr);
    // expect(component.hasQr).toBeTruthy();
    // expect(component.qrLabel).toBe(hasQrLabel);
  });

});
