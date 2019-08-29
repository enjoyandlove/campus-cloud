import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { CPDate } from '@campus-cloud/shared/utils/date';
import { mockSchool } from '@campus-cloud/session/mock';
import { CPI18nService } from '@campus-cloud/shared/services';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { getElementByCPTargetValue } from '@campus-cloud/shared/utils/tests';
import { IntegrationStatus } from './../../model/integration.interface';
import { IEventIntegration } from './../../../events/model/event-integration.interface';
import { IntegrationsSyncNowButtonComponent } from './integrations-sync-now-button.component';
import { mockIntegration } from '@campus-cloud/containers/controlpanel/manage/calendars/integrations/tests';

describe('IntegrationsSyncNowButtonComponent', () => {
  let de: DebugElement;
  let session: CPSession;
  let component: IntegrationsSyncNowButtonComponent;
  let fixture: ComponentFixture<IntegrationsSyncNowButtonComponent>;

  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        providers: [CPSession, CPI18nService],
        imports: [SharedModule],
        declarations: [IntegrationsSyncNowButtonComponent]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationsSyncNowButtonComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    component.integration = mockIntegration;
    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    fixture.detectChanges();
  });

  it('should be disable if sync now is false', () => {
    let syncNowBtn: HTMLButtonElement;
    const canSyncSpy = spyOn(component, 'canSync');

    canSyncSpy.and.returnValue(false);
    fixture.detectChanges();

    syncNowBtn = getElementByCPTargetValue(de, 'sync_btn').nativeElement;

    expect(syncNowBtn.disabled).toBe(true);

    syncNowBtn = getElementByCPTargetValue(de, 'sync_btn').nativeElement;

    canSyncSpy.and.returnValue(true);
    fixture.detectChanges();

    expect(syncNowBtn.disabled).toBe(false);
  });

  it('should return true if sync_status is running ', () => {
    let result: boolean;
    let feed: IEventIntegration;
    const nowMinusAnHour = CPDate.now(mockSchool.tz_zoneinfo_str)
      .subtract(1, 'hour')
      .unix();

    feed = {
      ...mockIntegration,
      sync_status: IntegrationStatus.pending,
      last_successful_sync_epoch: nowMinusAnHour
    };

    result = component.canSync(feed);

    expect(result).toBe(true);

    feed = {
      ...feed,
      sync_status: IntegrationStatus.running
    };

    result = component.canSync(feed);
    expect(result).toBe(false);
  });

  it('should return true if last_successful_sync_epoch is invalid', () => {
    let result: boolean;
    let feed: IEventIntegration;
    const invalidSyncTime = CPDate.now(mockSchool.tz_zoneinfo_str).unix();
    const validSyncTime = CPDate.now(mockSchool.tz_zoneinfo_str)
      .subtract(1, 'hour')
      .unix();

    feed = {
      ...mockIntegration,
      sync_status: IntegrationStatus.pending,
      last_successful_sync_epoch: validSyncTime
    };

    result = component.canSync(feed);

    expect(result).toBe(true);

    feed = {
      ...feed,
      last_successful_sync_epoch: invalidSyncTime
    };

    result = component.canSync(feed);
    expect(result).toBe(false);
  });
});
