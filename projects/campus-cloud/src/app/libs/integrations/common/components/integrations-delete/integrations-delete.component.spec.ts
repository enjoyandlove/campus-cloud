import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CPI18nService } from '@app/shared/services';
import { SharedModule } from '@shared/shared.module';
import { IntegrationsDeleteComponent } from './integrations-delete.component';
import { mockIntegration } from '@campus-cloud/src/app/containers/controlpanel/manage/calendars/integrations/tests';

describe('IntegrationsDeleteComponent', () => {
  let component: IntegrationsDeleteComponent;
  let fixture: ComponentFixture<IntegrationsDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      providers: [CPI18nService],
      declarations: [IntegrationsDeleteComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationsDeleteComponent);
    component = fixture.componentInstance;

    component.eventIntegration = mockIntegration;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
