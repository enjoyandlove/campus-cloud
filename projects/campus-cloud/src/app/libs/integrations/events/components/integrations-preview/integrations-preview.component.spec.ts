import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { mockEventIntegrationPreview } from '../tests/mock';
import { CPSession } from '@campus-cloud/session';
import { CPDatePipe } from '@campus-cloud/shared/pipes';
import { MockCPSession } from '@campus-cloud/session/mock';
import { IntegrationsPreviewComponent } from './integrations-preview.component';

describe('IntegrationsPreviewComponent', () => {
  let component: IntegrationsPreviewComponent;
  let fixture: ComponentFixture<IntegrationsPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IntegrationsPreviewComponent, CPDatePipe],
      providers: [
        {
          provide: CPSession,
          useValue: MockCPSession
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build table', () => {
    component.items = mockEventIntegrationPreview;

    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tr.preview-item'));
    expect(rows.length).toBe(5);
  });
});
