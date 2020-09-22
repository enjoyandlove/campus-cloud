/* tslint:disable:no-unused-variable */
import { Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { provideMockStore } from '@ngrx/store/testing';
import { CPSession } from '@projects/campus-cloud/src/app/session';
import { of } from 'rxjs';
import { EngagementService } from '../../../../assess/engagement/engagement.service';
import { EngagementUtilsService } from '../../../../assess/engagement/engagement.utils.service';
import { DashboardUtilsService } from '../../../../dashboard/dashboard.utils.service';
import * as fromStore from '../../store';
import { HealthDashboardActionBoxComponent } from './health-dashboard-action-box.component';

@Injectable()
class MockEngagementUtilsService extends EngagementUtilsService {
  getAudienceFilter() {
    return of([
      {
        route_id: null,
        cohort_type: null,
        label: '',
        listId: null
      }
    ]);
  }
}

@Injectable()
class MockDashboardUtilsService extends DashboardUtilsService {
  last30Days: () => {
    start: 0,
    end: 0,
    label: ''
  };
  last90Days: () => {
    start: 0,
    end: 0,
    label: ''
  };
  lastYear: () => {
    start: 0,
    end: 0,
    label: ''
  };
}

describe('HealthDashboardActionBoxComponent', () => {
  let component: HealthDashboardActionBoxComponent;
  let fixture: ComponentFixture<HealthDashboardActionBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HealthDashboardActionBoxComponent],
      imports: [CPTestModule],
      providers: [
        { provide: EngagementUtilsService, useClass: MockEngagementUtilsService },
        { provide: DashboardUtilsService, useClass: MockDashboardUtilsService },
        EngagementService,
        CPSession,
        provideMockStore({
          selectors: [
            {
              selector: fromStore.selectAudienceFilter,
              value: {}
            },
            {
              selector: fromStore.selectDateFilter,
              value: {}
            }
          ]
        })
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthDashboardActionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
