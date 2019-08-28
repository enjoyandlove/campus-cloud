import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock';
import { IEventIntegration } from '../../model';
import { CPI18nService } from '@campus-cloud/shared/services';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { getElementByCPTargetValue } from '@campus-cloud/shared/utils/tests';
import { EventIntegration } from '@campus-cloud/libs/integrations/events/model';
import { EventIntegrationsListComponent } from './integrations-list.component';
import { mockIntegration } from '@campus-cloud/containers/controlpanel/manage/events/integrations/tests';
import { CommonIntegrationsModule } from '@campus-cloud/libs/integrations/common/common-integrations.module';
import { EventsIntegrationsModule } from '@campus-cloud/libs/integrations/events/events-integrations.module';

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

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EventIntegrationsListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    component.integrations$ = of([mockIntegration]);
    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    fixture.detectChanges();
  }));

  it('should render items on list', () => {
    const list = de.queryAll(By.css('.cp-form__item'));

    expect(list.length).toBe(1);
  });
});
