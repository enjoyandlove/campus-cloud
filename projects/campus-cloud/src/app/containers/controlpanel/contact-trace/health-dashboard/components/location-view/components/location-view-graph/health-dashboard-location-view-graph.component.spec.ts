import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { HealthDashboardLocationViewGraphComponent } from './health-dashboard-location-view-graph.component';

describe('HealthDashboardLocationViewGraphComponent', () => {
  let component: HealthDashboardLocationViewGraphComponent;
  let fixture: ComponentFixture<HealthDashboardLocationViewGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HealthDashboardLocationViewGraphComponent, CPI18nPipe],
      providers: [CPI18nPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthDashboardLocationViewGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
