/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { provideMockStore } from '@ngrx/store/testing';
import { EChartsService } from '@projects/ready-ui/src/lib/charts/providers/echarts/echarts.service';
import { HealthDashboardCaseStatusGraphComponent } from './health-dashboard-case-status-graph.component';
import * as fromStore from '../../store';


describe('HealthDashboardCaseStatusGraphComponent', () => {
  let component: HealthDashboardCaseStatusGraphComponent;
  let fixture: ComponentFixture<HealthDashboardCaseStatusGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthDashboardCaseStatusGraphComponent ],
      imports: [CPTestModule],
      providers: [
        EChartsService,
        provideMockStore({
          selectors: [
            {
              selector: fromStore.selectCaseStatusStatsLoading,
              value: false
            },
            {
              selector: fromStore.selectCaseStatusData,
              value: []
            },
            {
              selector: fromStore.selectCaseStatusStatsForGraph,
              value: {
                ranges: [],
                data: {}
              }
            }
          ]
        })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthDashboardCaseStatusGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
