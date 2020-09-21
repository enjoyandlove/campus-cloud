import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';

import { HealthDashboardFormCompletionGraphComponent } from './health-dashboard-form-completion-graph.component';

describe('HealthDashboardFormCompletionGraphComponent', () => {
  let component: HealthDashboardFormCompletionGraphComponent;
  let fixture: ComponentFixture<HealthDashboardFormCompletionGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HealthDashboardFormCompletionGraphComponent, CPI18nPipe],
      providers: [CPI18nPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthDashboardFormCompletionGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
