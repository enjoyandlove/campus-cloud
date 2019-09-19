import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CPTestModule } from '@campus-cloud/shared/tests';
import { DashboardService } from './../../dashboard.service';
import { DashboardAppUsageComponent } from './dashboard-app-usage.component';
import { of } from 'rxjs';

class MockDashboardService {
  placeholder;
  getUserAcquisition(data) {
    this.placeholder = data;
    return of({
      app_opens: {
        labels: [],
        series: []
      },
      app_opens_unique: {
        labels: [],
        series: []
      }
    });
  }
}

describe('DashboardAppUsageComponent', () => {
  let component: DashboardAppUsageComponent;
  let fixture: ComponentFixture<DashboardAppUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule],
      providers: [{ provide: DashboardService, useClass: MockDashboardService }],
      declarations: [DashboardAppUsageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAppUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
