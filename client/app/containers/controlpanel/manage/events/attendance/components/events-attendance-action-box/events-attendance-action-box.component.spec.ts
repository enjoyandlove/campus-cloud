import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/index';

import { EventsModule } from '../../../events.module';
import { CPSession } from '../../../../../../../session';
import { EventUtilService } from '../../../events.utils.service';
import { mockUser } from '../../../../../../../session/mock/user';
import { mockSchool } from '../../../../../../../session/mock/school';
import { CPI18nService } from '../../../../../../../shared/services';
import { EventsAttendanceActionBoxComponent } from './events-attendance-action-box.component';

fdescribe('EventsAttendanceActionBoxComponent', () => {
  let component: EventsAttendanceActionBoxComponent;
  let fixture: ComponentFixture<EventsAttendanceActionBoxComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [EventsModule, HttpClientModule, RouterTestingModule],
        providers: [CPSession, CPI18nService, EventUtilService]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(EventsAttendanceActionBoxComponent);
          component = fixture.componentInstance;
          component.session.g.set('user', mockUser);
          component.session.g.set('school', mockSchool);
          component.updateQrCode = new BehaviorSubject(null);
          component.totalAttendees = new BehaviorSubject(null);

          component.event = {
            store_id: 12548
          };
        });
    })
  );

  it('should have canMessage privileges', () => {
    component.ngOnInit();
    // expect(component.canMessage).toBeTruthy();

    /*component.session.g.set('user', { school_level_privileges: {} });
    component.ngOnInit();
    expect(component.canMessage).toBeFalsy();*/
  });

  it('onTabClick - existing store', () => {
    component.updateQrCode.next([1, 2, 3]);

    component.ngOnInit();
    expect(component.hasQr).toBeTruthy();
  });
});
