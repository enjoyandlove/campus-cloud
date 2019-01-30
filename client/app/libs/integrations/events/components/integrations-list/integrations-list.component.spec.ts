import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { CPSession } from '@app/session';
import { SharedModule } from '@shared/shared.module';
import { getElementByCPTargetValue } from '@client/app/shared/utils/tests';
import { EventIntegrationsListComponent } from './integrations-list.component';
import { CommonIntegrationsModule } from '@libs/integrations/common/common-integrations.module';
import { EventsIntegrationsModule } from '@libs/integrations/events/events-integrations.module';
import { mockIntegration } from '@client/app/containers/controlpanel/manage/events/integrations/tests';

describe('EventIntegrationsListComponent', () => {
  let de: DebugElement;
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

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render items on list', () => {
    const list = de.queryAll(By.css('.cp-form__item'));

    expect(list.length).toBe(1);
  });

  it('should emit syncClick', () => {
    spyOn(component.syncClick, 'emit');
    const syncNowBtn: HTMLButtonElement = getElementByCPTargetValue(de, 'sync_btn').nativeElement;

    syncNowBtn.click();

    expect(component.syncClick.emit).toHaveBeenCalled();
  });
});
