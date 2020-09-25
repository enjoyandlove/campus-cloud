/* tslint:disable:no-unused-variable */
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { CPSession } from '@campus-cloud/session';
import { HealthDashboardComponent } from './health-dashboard.component';
import { mockSchool } from '@campus-cloud/session/mock';

@Component({
  selector: 'cp-health-dashboard-action-box',
  template: '<p>cp-health-dashboard-action-box</p>'
})
class MockHealthDashboardActionBoxComponent {}

@Component({
  selector: 'cp-status-cards',
  template: '<p>cp-status-cards</p>'
})
class MockStatusCardsComponent {}

@Component({
  selector: 'cp-health-dashboard-case-status-graph',
  template: '<p>It works!</p>'
})
class MockHealthDashboardCaseStatusGraphComponent {}

@Component({
  selector: 'cp-health-dashboard-form-completion',
  template: '<p>It works!</p>'
})
class MockHealthDashboardFormCompletionComponent {}

@Component({
  selector: 'cp-health-dashboard-location-view',
  template: '<p>It works!</p>'
})
class MockHealthDashboardLocationViewComponent {}

describe('HealthDashboardComponent', () => {
  let component: HealthDashboardComponent;
  let fixture: ComponentFixture<HealthDashboardComponent>;
  let session: CPSession;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HealthDashboardComponent,
        MockHealthDashboardActionBoxComponent,
        MockStatusCardsComponent,
        MockHealthDashboardCaseStatusGraphComponent,
        MockHealthDashboardFormCompletionComponent,
        MockHealthDashboardLocationViewComponent
      ],
      imports: [CPTestModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthDashboardComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
