import { Component, OnDestroy, OnInit } from '@angular/core';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { HttpParams } from '@angular/common/http';
import { CPSession } from '@campus-cloud/session';
import {
  ChartsUtilsService,
  DivideBy,
  groupByMonth,
  groupByQuarter,
  groupByWeek
} from '@campus-cloud/shared/services';
import { HealthDashboardUtilsService } from '../../health-dashboard.utils.service';
import { FormsService } from '../../../forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  share,
  startWith,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import { Observable, of, Subject, merge } from 'rxjs';
import { HealthDashboardService } from '../../health-dashboard.service';
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';

const year = 365;
const threeMonths = 90;
const twoYears = year * 2;

@Component({
  selector: 'cp-health-dashboard-form-completion',
  templateUrl: './health-dashboard-form-completion.component.html',
  styleUrls: ['./health-dashboard-form-completion.component.scss']
})
export class HealthDashboardFormCompletionComponent implements OnInit, OnDestroy {
  loading: boolean;
  groupByDateForm;
  chartData;
  series;
  labels;
  range;
  divider = DivideBy.daily;

  formsSearchTermStream = new Subject();
  formsPageStream = new Subject<number>();
  formsSearchTerm: string;
  formsPageCounter = 1;
  formsPaginationCountPerPage = 10;
  formsHasMorePages = false;
  formData = [];
  selectedForms = [];

  filters = [];

  sources = {
    tileViews: 0,
    tileCompleted: 0,
    webViews: 0,
    webCompleted: 0
  };

  handleTimeOut = null;

  audienceFilter$: Observable<Record<number, any>>;
  audienceFilter = null;

  dateFilter$: Observable<Record<number, any>>;
  dateFilter = null;

  destroy$ = new Subject();

  constructor(
    public store: Store<{ healthDashboard: fromStore.HealthDashboardState }>,
    public cpI18n: CPI18nPipe,
    public service: HealthDashboardService,
    public formsService: FormsService,
    private session: CPSession,
    public chartUtils: ChartsUtilsService,
    public utils: HealthDashboardUtilsService
  ) {
    this.registerFilterStates();
  }

  fetch() {
    let params;

    params = new HttpParams().set('school_id', this.session.g.get('school').id);

    if (this.filters.length > 0) {
      params = params.append('form_ids', this.filters.join(','));
    }
    if (this.audienceFilter !== null) {
      params = params.append('user_list_id', this.audienceFilter.listId);
    }

    if (this.dateFilter !== null) {
      params = params.append('start', this.dateFilter.start).append('end', this.dateFilter.end);
    }
    this.loading = true;

    const stream$ = this.service.getFormResponseStats(params);
    stream$
      .toPromise()
      .then((res: any) => {
        this.loading = false;

        if (res.length === 0) {
          this.labels = [];
          this.series = [];
          return;
        }

        res.map((item) => {
          if (item.collection_method === 1) {
            item.response_completed_epoch === -1
              ? this.sources.tileViews++
              : this.sources.tileCompleted++;
          } else if (item.collection_method === 2) {
            item.response_completed_epoch === -1
              ? this.sources.webViews++
              : this.sources.webCompleted++;
          }
        });

        this.groupByDateForm = this.utils.getCompletedForm(res);
        this.chartData = this.groupByDateForm.reduce(
          (prev, item) => {
            return {
              label: [...prev.label, this.utils.formatDate(item.date)],
              seriesComplete: [...prev.seriesComplete, item.count.complete],
              seriesViews: [...prev.seriesViews, item.count.views]
            };
          },
          { label: new Array(), seriesComplete: new Array(), seriesViews: new Array() }
        );

        const labels = this.utils.getDateArray(
          this.groupByDateForm[0].date,
          this.groupByDateForm[this.groupByDateForm.length - 1].date
        );

        let newSeriesComplete = [];
        let newSeriesViews = [];

        labels.map((item) => {
          if (this.chartData.label.includes(item)) {
            newSeriesComplete = [
              ...newSeriesComplete,
              this.chartData.seriesComplete[this.chartData.label.indexOf(item)]
            ];
            newSeriesViews = [
              ...newSeriesViews,
              this.chartData.seriesViews[this.chartData.label.indexOf(item)]
            ];
          } else {
            newSeriesComplete = [...newSeriesComplete, 0];
            newSeriesViews = [...newSeriesViews, 0];
          }
        });

        const series = [newSeriesComplete, newSeriesViews];
        const data = { labels: labels, series: series };

        this.range = Object.assign({}, this.range, {
          start: data.labels[0],
          end: data.labels[data.labels.length - 1]
        });
        if (data.series[0].length >= twoYears) {
          this.divider = DivideBy.quarter;

          return Promise.all([
            groupByQuarter(data.labels, data.series[0]),
            groupByQuarter(data.labels, data.series[1])
          ]);
        }

        if (data.series[0].length >= year) {
          this.divider = DivideBy.monthly;

          return Promise.all([
            groupByMonth(data.labels, data.series[0]),
            groupByMonth(data.labels, data.series[1])
          ]);
        }

        if (data.series[0].length >= threeMonths) {
          this.divider = DivideBy.weekly;

          return Promise.all([
            groupByWeek(data.labels, data.series[0]),
            groupByWeek(data.labels, data.series[1])
          ]);
        }

        this.divider = DivideBy.daily;
        return Promise.resolve(data.series);
      })
      .then((series: any) => {
        if (series) {
          this.labels = this.chartUtils.buildLabels(this.divider, this.range, series);
          this.series = series.map((data: number[], idx: number) => {
            return {
              data,
              type: 'line',
              name:
                idx === 0
                  ? this.cpI18n.transform('contact_trace_forms_completed')
                  : this.cpI18n.transform('health_dashboard_views')
            };
          });
        }
      });
  }

  registerFilterStates() {
    this.audienceFilter$ = this.store.select(fromStore.selectAudienceFilter).pipe(startWith({}));
    this.audienceFilter$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        this.audienceFilter = value;
        this.fetch();
      }
    });

    this.dateFilter$ = this.store.select(fromStore.selectDateFilter).pipe(startWith({}));
    this.dateFilter$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        this.dateFilter = value;
        this.fetch();
      }
    });
  }

  handleClearSelectedForms() {
    this.filters = [];
    this.selectedForms = [];
    this.fetch();
  }

  formsLoadMoreClickHandler(): void {
    this.formsPageCounter++;
    this.formsPageStream.next(this.formsPageCounter);
  }

  fetchForms(page): Observable<any[]> {
    const startRecordCount = this.formsPaginationCountPerPage * (page - 1) + 1;
    // Get an extra record so that we know if there are more records left to fetch
    const endRecordCount = this.formsPaginationCountPerPage * page + 1;

    const params = new HttpParams()
      .set('school_id', this.session.school.id.toString())
      .set('is_template', 'false')
      .set('status', '1')
      .set(
        'search_str',
        Boolean(this.formsSearchTerm && this.formsSearchTerm.trim().length)
          ? this.formsSearchTerm.trim()
          : null
      );

    return this.formsService.searchForms(startRecordCount, endRecordCount, params).pipe(
      map((results: any[]) => {
        if (results && results.length > this.formsPaginationCountPerPage) {
          this.formsHasMorePages = true;
          // Remove the extra record that we fetched to check if we have more records to fetch.
          results = results.splice(0, this.formsPaginationCountPerPage);
        } else {
          this.formsHasMorePages = false;
        }
        return results;
      }),
      catchError(() => of([]))
    ) as Observable<any[]>;
  }

  handleForm(form: any) {
    const index = this.filters.indexOf(form.id);
    if (index > -1) {
      this.filters.splice(index, 1);
      this.selectedForms.splice(this.selectedForms.indexOf(form), 1);
    } else {
      this.filters.push(form.id);
      this.selectedForms.push(form);
    }

    if (this.handleTimeOut) {
      clearTimeout(this.handleTimeOut);
    }
    this.handleTimeOut = setTimeout(() => {
      this.fetch();
    }, 1500);
  }

  ngOnInit(): void {
    this.fetch();

    const formsSearchSource = this.formsSearchTermStream.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((searchTerm: string) => {
        this.formsSearchTerm = searchTerm;
        this.formsPageCounter = 1;
        return { searchTerm: searchTerm, page: this.formsPageCounter };
      })
    );

    const formsPageSource = this.formsPageStream.pipe(
      map((pageNumber) => {
        this.formsPageCounter = pageNumber;
        return { searchTerm: this.formsSearchTerm, page: pageNumber };
      })
    );

    const formsSearchCombinedSource: Observable<any[]> = merge(
      formsPageSource,
      formsSearchSource
    ).pipe(
      startWith({ searchTerm: this.formsSearchTerm, page: this.formsPageCounter }),
      switchMap((params: { searchTerm: string; page: number }) => {
        return this.fetchForms(params.page);
      }),
      share()
    );

    formsSearchCombinedSource.subscribe((data) => (this.formData = [...this.formData, ...data]));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
