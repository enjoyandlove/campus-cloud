import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ICaseStatus } from '@controlpanel/contact-trace/cases/cases.interface';
import { select, Store } from '@ngrx/store';
import { EChartsService } from '@projects/ready-ui/src/lib/charts/providers/echarts/echarts.service';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import * as fromStore from '../../store';

interface ICaseStatusGraph {
  ranges: any[];
  data: {
    1: any[];
    2: any[];
    3: any[];
    4: any[];
    5: any[];
  };
  caseStatuses: ICaseStatus[];
}

@Component({
  selector: 'cp-health-dashboard-case-status-graph',
  templateUrl: './health-dashboard-case-status-graph.component.html',
  styleUrls: ['./health-dashboard-case-status-graph.component.scss']
})
export class HealthDashboardCaseStatusGraphComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chart') chart: ElementRef;
  stats$: Observable<ICaseStatusGraph>;
  loading$: Observable<boolean>;
  destroy$ = new Subject();

  constructor(
    private echartService: EChartsService,
    private store: Store<{ healthDashboard: fromStore.HealthDashboardState }>,
  ) {
    this.loading$ = this.store.pipe(
      select(fromStore.selectCaseStatusStatsLoading),
      takeUntil(this.destroy$)
    );
  }

  ngAfterViewInit() {
    this.stats$ = combineLatest([
      this.store.select(fromStore.selectCaseStatusData),
      this.store.select(fromStore.selectCaseStatusStatsForGraph),
    ]).pipe(
      takeUntil(this.destroy$),
      map(([caseStatuses, stats]) => {
        return {
          ...stats,
          caseStatuses
        };
      })
    );

    this.stats$.subscribe(stats => {
      this.generateChart(stats);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  generateChart(stats: ICaseStatusGraph) {
    const chart = this.echartService.init(this.chart.nativeElement);
    const xAxisData = stats.ranges.map(date => date.format('MMM D'));
    const caseStatuses = stats.caseStatuses.slice();
    caseStatuses.sort((a, b) => a.id - b.id);
    const legendData = caseStatuses.map(item => item.name);
    const colors = caseStatuses.map(item => `#${item.color}`);
    const series = caseStatuses.map(item => ({
      name: item.name,
      data: stats.data[item.id],
      type: 'line'
    }));

    this.echartService.setOptions(chart, {
      legend: {
        data: legendData,
        icon: 'circle',
        right: 0,
        top: 'middle',
        orient: 'vertical',
        itemGap: 20,
        textStyle: {
          color: '#000'
        }
      },
      grid: {
        left: 20,
        right: 140,
        top: 30,
        bottom: 10,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
        axisLine: {
          show: false,
          lineStyle: {
            color: '#212121'
          }
        },
        axisTick: {
          show: false
        },
        offset: 10,
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
          lineStyle: {
            color: '#212121'
          }
        },
        axisTick: {
          show: false
        },
        offset: 20,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#212121',
        textStyle: {
          color: '#BDBDBD'
        },
        padding: 7,
      },
      series: series,
      color: colors
    });
  }
}
