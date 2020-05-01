import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CPSession } from '@campus-cloud/session';
import { CPDatePipe } from '@campus-cloud/shared/pipes';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { MockCPSession } from '@campus-cloud/session/mock';
import { mockEventIntegrationPreview } from '../tests/mock';
import { IntegrationsPreviewComponent } from './integrations-preview.component';

describe('IntegrationsPreviewComponent', () => {
  let component: IntegrationsPreviewComponent;
  let fixture: ComponentFixture<IntegrationsPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule],
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
