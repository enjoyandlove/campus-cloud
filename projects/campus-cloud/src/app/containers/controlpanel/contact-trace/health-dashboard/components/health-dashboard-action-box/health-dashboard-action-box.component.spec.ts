/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { provideMockStore } from '@ngrx/store/testing';
import { CPSession } from '@projects/campus-cloud/src/app/session';
import { of } from 'rxjs';
import { EngagementService } from '../../../../assess/engagement/engagement.service';
import { EngagementUtilsService } from '../../../../assess/engagement/engagement.utils.service';
import { HealthDashboardActionBoxComponent } from './health-dashboard-action-box.component';
import * as fromStore from '../../store';

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

describe('HealthDashboardActionBoxComponent', () => {
  let component: HealthDashboardActionBoxComponent;
  let fixture: ComponentFixture<HealthDashboardActionBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HealthDashboardActionBoxComponent],
      imports: [CPTestModule],
      providers: [
        { provide: EngagementUtilsService, useClass: MockEngagementUtilsService },
        EngagementService,
        CPSession,
        provideMockStore({
          selectors: [
            {
              selector: fromStore.selectAudienceFilter,
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
