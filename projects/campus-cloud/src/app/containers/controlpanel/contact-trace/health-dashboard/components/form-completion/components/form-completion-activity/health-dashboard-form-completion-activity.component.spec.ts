import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CPI18nPipe } from '@projects/campus-cloud/src/app/shared/pipes';
import { CPTestModule } from '@projects/campus-cloud/src/app/shared/tests';
import { of } from 'core-js/fn/array';
import { HealthDashboardService } from '../../../../health-dashboard.service';

import { HealthDashboardFormCompletionActivityComponent } from './health-dashboard-form-completion-activity.component';

describe('HealthDashboardFormCompletionActivityComponent', () => {
  let component: HealthDashboardFormCompletionActivityComponent;
  let fixture: ComponentFixture<HealthDashboardFormCompletionActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HealthDashboardFormCompletionActivityComponent],
      imports: [CPTestModule],
      providers: [CPI18nPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthDashboardFormCompletionActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
