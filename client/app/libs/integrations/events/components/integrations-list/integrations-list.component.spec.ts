import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { CPSession } from '@app/session';
import { mockSchool } from '@app/session/mock';
import { IEventIntegration } from '../../model';
import { CPI18nService } from '@shared/services';
import { configureTestSuite } from '@shared/tests';
import { SharedModule } from '@shared/shared.module';
import { getElementByCPTargetValue } from '@shared/utils/tests';
import { EventIntegration } from '@libs/integrations/events/model';
import { EventIntegrationsListComponent } from './integrations-list.component';
import { mockIntegration } from '@containers/controlpanel/manage/events/integrations/tests';
import { CommonIntegrationsModule } from '@libs/integrations/common/common-integrations.module';
import { EventsIntegrationsModule } from '@libs/integrations/events/events-integrations.module';

describe('EventIntegrationsListComponent', () => {
  let de: DebugElement;
  let session: CPSession;
  let component: EventIntegrationsListComponent;
  let fixture: ComponentFixture<EventIntegrationsListComponent>;

  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        providers: [CPSession, CPI18nService],
        imports: [SharedModule, CommonIntegrationsModule, EventsIntegrationsModule],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  beforeEach(
    async(() => {
      fixture = TestBed.createComponent(EventIntegrationsListComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;

      component.integrations$ = of([mockIntegration]);
      session = TestBed.get(CPSession);
      session.g.set('school', mockSchool);

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render items on list', () => {
    const list = de.queryAll(By.css('.cp-form__item'));

    expect(list.length).toBe(1);
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
