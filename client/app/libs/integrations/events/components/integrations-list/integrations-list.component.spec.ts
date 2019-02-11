import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { CPSession } from '@app/session';
import { mockSchool } from '@app/session/mock';
import { IEventIntegration } from '../../model';
import { CPDate } from '@shared/utils/date/date';
import { SharedModule } from '@shared/shared.module';
import { IntegrationStatus } from '../../../common/model';
import { getElementByCPTargetValue } from '@client/app/shared/utils/tests';
import { EventIntegration } from '@client/app/libs/integrations/events/model';
import { EventIntegrationsListComponent } from './integrations-list.component';
import { CommonIntegrationsModule } from '@libs/integrations/common/common-integrations.module';
import { EventsIntegrationsModule } from '@libs/integrations/events/events-integrations.module';
import { mockIntegration } from '@client/app/containers/controlpanel/manage/events/integrations/tests';

describe('EventIntegrationsListComponent', () => {
  let de: DebugElement;
  let session: CPSession;
  let component: EventIntegrationsListComponent;
  let fixture: ComponentFixture<EventIntegrationsListComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        providers: [CPSession],
        imports: [SharedModule, CommonIntegrationsModule, EventsIntegrationsModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EventIntegrationsListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    component.integrations$ = of([mockIntegration]);
    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render items on list', () => {
    const list = de.queryAll(By.css('.cp-form__item'));

    expect(list.length).toBe(1);
  });

  describe('sync now button', () => {
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
  });

  describe('canSync', () => {
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

  it('should display tooltip when canSync is false', () => {
    let integration: IEventIntegration;
    let syncNowBtnWrapper: HTMLSpanElement;

    integration = {
      ...mockIntegration,
      sync_status: EventIntegration.status.running
    };

    component.integrations$ = of([integration]);
    fixture.detectChanges();

    syncNowBtnWrapper = getElementByCPTargetValue(de, 'sync_btn_wrapper').nativeElement;

    expect(syncNowBtnWrapper.getAttribute('data-original-title')).not.toBeNull();

    integration = {
      ...mockIntegration,
      sync_status: EventIntegration.status.pending
    };

    component.integrations$ = of([integration]);
    fixture.detectChanges();

    syncNowBtnWrapper = getElementByCPTargetValue(de, 'sync_btn_wrapper').nativeElement;

    expect(syncNowBtnWrapper.getAttribute('data-original-title')).toBeNull();
  });
});
