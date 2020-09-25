/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { provideMockStore } from '@ngrx/store/testing';
import { CPI18nPipe } from '@projects/campus-cloud/src/app/shared/pipes';
import { EChartsService } from '@projects/ready-ui/src/lib/charts/providers/echarts/echarts.service';
import { CasesService } from '../../../cases/cases.service';
import { CasesUtilsService } from '../../../cases/cases.utils.service';
import * as fromStore from '../../store';
import { HealthDashboardCaseStatusGraphComponent } from './health-dashboard-case-status-graph.component';

describe('HealthDashboardCaseStatusGraphComponent', () => {
  let component: HealthDashboardCaseStatusGraphComponent;
  let fixture: ComponentFixture<HealthDashboardCaseStatusGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HealthDashboardCaseStatusGraphComponent],
      imports: [CPTestModule],
      providers: [
        EChartsService,
        CasesService,
        CasesUtilsService,
        CPI18nPipe,
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
            },
            {
              selector: fromStore.selectDateFilter,
              value: {}
            },
            {
              selector: fromStore.selectAudienceFilter,
              value: {audience: null}
            }
          ]
        })
      ]
    }).compileComponents();
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
