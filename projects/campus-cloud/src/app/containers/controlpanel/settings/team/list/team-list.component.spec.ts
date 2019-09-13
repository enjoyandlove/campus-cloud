import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { PhraseAppKeys } from '../team.utils.service';
import { mockSchool } from '@campus-cloud/session/mock';
import { TeamListComponent } from './team-list.component';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { CPSpinnerComponent } from '@campus-cloud/shared/components';
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
  let session: CPSession;
  let component: TeamListComponent;
  let fixture: ComponentFixture<TeamListComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamListComponent);
    component = fixture.componentInstance;
    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    spyError = spyOn(component, 'handleError');
    spySuccess = spyOn(component, 'handleSuccess');

    component.loading = false;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('cp-spinner', () => {
    it('should show on loading true', () => {
      component.loading = true;

      fixture.detectChanges();

      const spinnerComp = de.query(By.directive(CPSpinnerComponent));
      expect(spinnerComp).not.toBeNull();
    });

    it('should not show on loading false', () => {
      component.loading = false;

      fixture.detectChanges();

      const spinnerComp = de.query(By.directive(CPSpinnerComponent));
      expect(spinnerComp).toBeNull();
    });
  });

  describe('list filter', () => {
    it('onSearch', () => {
      const fetch = spyOn(component, 'fetch');
      const resetPagination = spyOn(component, 'resetPagination');

      const expected = 'something';
      component.onSearch(expected);

      expect(fetch).toHaveBeenCalled();
      expect(resetPagination).toHaveBeenCalled();
      expect(component.state.search_str).toBe(expected);
    });

    it('doSort', () => {
      const fetch = spyOn(component, 'fetch');

      const expected = 'something';
      component.doSort(expected);

      expect(fetch).toHaveBeenCalled();
      expect(component.state.sort_field).toBe(expected);
      expect(component.state.sort_direction).toBe('desc');
    });
  });

  describe('cp-pagination', () => {
    it('should set initial pagination', () => {
      expect(component.pageNumber).toBe(1);
      expect(component.startRange).toBe(1);
    });

    it('should go to next page on onPaginationNext', () => {
      const fetch = spyOn(component, 'fetch');
      spyOn(BaseComponent.prototype, 'goToNext');

      component.onPaginationNext();

      expect(fetch).toHaveBeenCalled();
      expect(BaseComponent.prototype.goToNext).toHaveBeenCalled();
    });

    it('should go to previous on onPaginationPrevious', () => {
      const fetch = spyOn(component, 'fetch');
      spyOn(BaseComponent.prototype, 'goToNext');

      component.onPaginationNext();

      expect(fetch).toHaveBeenCalled();
      expect(BaseComponent.prototype.goToNext).toHaveBeenCalled();
    });
  });

  describe('resend invite', () => {
    it('should resend invite success', () => {
      const index = 1;
      spy = spyOn(component.adminService, 'updateAdmin').and.returnValue(of([]));

      component.onResendInvite(mockTeam, index);

      expect(spy).toHaveBeenCalled();
      expect(component.disabledSendInviteButtons[index]).toBe(true);
      expect(spySuccess).toHaveBeenCalledWith(PhraseAppKeys.inviteSuccess);
    });

    it('should resend invite error', () => {
      const index = 1;
      spy = spyOn(component.adminService, 'updateAdmin').and.returnValue(
        throwError(new Error('fake error'))
      );

      component.onResendInvite(mockTeam, index);

      expect(spy).toHaveBeenCalled();
      expect(spyError).toHaveBeenCalled();
      expect(component.disabledSendInviteButtons[index]).toBe(false);
    });

    it('should show resend invite button for pending user status', fakeAsync(() => {
      spyOn(component.adminService, 'getAdmins').and.returnValue(of([mockTeam]));

      component.fetch();
      tick();

      fixture.detectChanges();

      const resendButton = getElementByCPTargetValue(de, 'resend_invite');
      expect(resendButton.nativeElement).not.toBeNull();
    }));

    it('should not show resend invite button for active user status', fakeAsync(() => {
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

    it('should track resend invite', () => {
      const index = 1;
      const spyTracking = spyOn(component.cpTracking, 'amplitudeEmitEvent');
      spyOn(component.adminService, 'updateAdmin').and.returnValue(of([]));

      component.onResendInvite(mockTeam, index);

      const eventProperties = {
        source: amplitudeEvents.EXTERNAL,
        invite_type: amplitudeEvents.RESENT_INVITE
      };

      expect(spyTracking).toHaveBeenCalled();
      expect(spyTracking).toHaveBeenCalledWith(
        amplitudeEvents.INVITED_TEAM_MEMBER,
        eventProperties
      );
    });
  });

  describe('Admins List', () => {
    it('should not have admins if the items are empty', () => {
      const spy = spyOn(component.adminService, 'getAdmins').and.returnValue(of([]));
      component.ngOnInit();

      expect(spy).toHaveBeenCalled();
      expect(component.state.admins.length).toEqual(0);
    });

    it('should have admins if the items have data', fakeAsync(() => {
      const spy = spyOn(component.adminService, 'getAdmins').and.returnValue(of([mockTeam]));
      component.ngOnInit();

      tick();
      expect(spy).toHaveBeenCalled();
      expect(component.state.admins.length).toEqual(1);
    }));
  });
});
