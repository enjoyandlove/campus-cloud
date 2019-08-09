import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { PhraseAppKeys } from '../team.utils.service';
import { mockSchool } from '@campus-cloud/session/mock';
import { TeamListComponent } from './team-list.component';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { mockTeam, MockAdminService, MockTrackingService } from '../tests';
import { getElementByCPTargetValue } from '@campus-cloud/shared/utils/tests';
import { AdminService, CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';

describe('TeamListComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule],
        providers: [
          CPSession,
          CPI18nService,
          provideMockStore(),
          { provide: AdminService, useClass: MockAdminService },
          { provide: CPTrackingService, useClass: MockTrackingService }
        ],
        declarations: [TeamListComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let spy;
  let spyError;
  let spySuccess;
  let de: DebugElement;
  let component: TeamListComponent;
  let fixture: ComponentFixture<TeamListComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamListComponent);
    component = fixture.componentInstance;
    component.session.g.set('school', mockSchool);

    spyError = spyOn(component, 'handleError');
    spySuccess = spyOn(component, 'handleSuccess');

    component.loading = false;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('Should resend invite success', () => {
    const index = 1;
    spy = spyOn(component.adminService, 'updateAdmin').and.returnValue(of([]));

    component.onResendInvite(mockTeam, index);

    expect(spy).toHaveBeenCalled();
    expect(component.disabledSendInviteButtons[index]).toBe(true);
    expect(spySuccess).toHaveBeenCalledWith(PhraseAppKeys.inviteSuccess);
  });

  it('Should resend invite error', () => {
    const index = 1;
    spy = spyOn(component.adminService, 'updateAdmin').and.returnValue(
      throwError(new Error('fake error'))
    );

    component.onResendInvite(mockTeam, index);

    expect(spy).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
    expect(component.disabledSendInviteButtons[index]).toBe(false);
  });

  it('Should show resend invite button for pending user status', fakeAsync(() => {
    spyOn(component.adminService, 'getAdmins').and.returnValue(of([mockTeam]));

    component.fetch();
    tick();

    fixture.detectChanges();

    const resendButton = getElementByCPTargetValue(de, 'resend_invite');
    expect(resendButton.nativeElement).not.toBeNull();
  }));

  it('Should not show resend invite button for active user status', fakeAsync(() => {
    const data = {
      ...mockTeam,
      account_activated: true
    };

    spyOn(component.adminService, 'getAdmins').and.returnValue(of([data]));
    const resendButton = getElementByCPTargetValue(de, 'resend_invite');

    component.fetch();
    tick();

    fixture.detectChanges();

    expect(resendButton).toBeNull();
  }));

  it('Should track resend invite', () => {
    const index = 1;
    const spyTracking = spyOn(component.cpTracking, 'amplitudeEmitEvent');
    spyOn(component.adminService, 'updateAdmin').and.returnValue(of([]));

    component.onResendInvite(mockTeam, index);

    const eventProperties = {
      source: amplitudeEvents.EXTERNAL,
      invite_type: amplitudeEvents.RESENT_INVITE
    };

    expect(spyTracking).toHaveBeenCalled();
    expect(spyTracking).toHaveBeenCalledWith(amplitudeEvents.INVITED_TEAM_MEMBER, eventProperties);
  });
});
