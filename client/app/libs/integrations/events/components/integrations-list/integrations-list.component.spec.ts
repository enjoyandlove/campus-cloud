import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { CPSession } from '@app/session';
import { SharedModule } from '@shared/shared.module';
import { EventIntegrationsListComponent } from './integrations-list.component';
import { CommonIntegrationsModule } from '@libs/integrations/common/common-integrations.module';
import { EventsIntegrationsModule } from '@libs/integrations/events/events-integrations.module';

describe('EventIntegrationsListComponent', () => {
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
