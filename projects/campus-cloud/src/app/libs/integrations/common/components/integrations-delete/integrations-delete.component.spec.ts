import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CPTestModule } from '@campus-cloud/shared/tests';
import { IntegrationsDeleteComponent } from './integrations-delete.component';
import { mockIntegration } from '@campus-cloud/containers/controlpanel/manage/calendars/integrations/tests';

describe('IntegrationsDeleteComponent', () => {
  let component: IntegrationsDeleteComponent;
  let fixture: ComponentFixture<IntegrationsDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule, RouterTestingModule],
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
