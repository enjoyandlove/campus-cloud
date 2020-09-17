/* tslint:disable:no-unused-variable */
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { HealthDashboardComponent } from './health-dashboard.component';

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

describe('HealthDashboardComponent', () => {
  let component: HealthDashboardComponent;
  let fixture: ComponentFixture<HealthDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HealthDashboardComponent,
        MockHealthDashboardActionBoxComponent,
        MockStatusCardsComponent,
      ],
      imports: [CPTestModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
