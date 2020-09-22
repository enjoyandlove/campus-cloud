import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';

import { HealthDashboardFormCompletionSourceComponent } from './health-dashboard-form-completion-source.component';

describe('HealthDashboardFormCompletionSourceComponent', () => {
  let component: HealthDashboardFormCompletionSourceComponent;
  let fixture: ComponentFixture<HealthDashboardFormCompletionSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HealthDashboardFormCompletionSourceComponent, CPI18nPipe],
      providers: [CPI18nPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthDashboardFormCompletionSourceComponent);
    component = fixture.componentInstance;
    component.sources = {
      tileViews: 5,
      tileCompleted: 3,
      webViews: 4,
      webCompleted: 2
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
