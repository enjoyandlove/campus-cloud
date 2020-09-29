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
import { ExportCategory, HealthDashboardUtilsService } from '../../health-dashboard.utils.service';
import { FormsService } from '@controlpanel/contact-trace/forms/services/forms.service';
import { catchError, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { combineLatest, from, merge, Observable, of, Subject } from 'rxjs';
import { HealthDashboardService } from '../../health-dashboard.service';
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';
import { privacyConfigurationOn } from '@projects/campus-cloud/src/app/shared/utils';

const year = 365;
const threeMonths = 90;
const twoYears = year * 2;

@Component({
  selector: 'cp-health-dashboard-form-completion',
  templateUrl: './health-dashboard-form-completion.component.html',
  styleUrls: ['./health-dashboard-form-completion.component.scss']
})
export class HealthDashboardFormCompletionComponent implements OnInit, OnDestroy {
  isPrivacyOn: boolean = false;
  loading: boolean;
  downloading: boolean = false;
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
  isFormSearching = false;
  filters = [];
  formFilter$ = new Subject<any>();

  sources = {
    tileViews: 0,
    tileCompleted: 0,
    webViews: 0,
    webCompleted: 0
  };

  activities = {
    never_submitted: 0,
    not_submitted_today: 0,
    unique_submissions_today: 0
  };

  handleTimeOut = null;

  audienceFilter$: Observable<Record<number, any>>;
  audienceFilter = null;

  dateFilter$: Observable<Record<number, any>>;
  dateFilter = null;

  formActivityStream$ = null;
  formResponseStream$ = null;

  destroy$ = new Subject();

  public get exportCategory(): typeof ExportCategory {
    return ExportCategory;
  }

  constructor(
    public store: Store<{ healthDashboard: fromStore.HealthDashboardState }>,
    public cpI18n: CPI18nPipe,
    public service: HealthDashboardService,
    public formsService: FormsService,
    private session: CPSession,
    public chartUtils: ChartsUtilsService,
    public utils: HealthDashboardUtilsService
  ) {}

  fetchFormResponseStats() {
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

    if (this.formResponseStream$) {
      this.formResponseStream$.unsubscribe();
    }

    if (this.formActivityStream$) {
      this.formActivityStream$.unsubscribe();
    }

    this.formResponseStream$ = this.service.getFormResponseStats(params).subscribe((data) => {
      this.fetchFormActivityInfo();
      this.buildChartSeries(data);
    });
  }

  fetchFormActivityInfo() {
    let params;

    params = new HttpParams().set('school_id', this.session.g.get('school').id);

    if (this.filters.length > 0) {
      params = params.append('form_ids', this.filters.join(','));
    }
    if (this.audienceFilter !== null) {
      params = params.append('user_list_id', this.audienceFilter.listId);
    }

    params = params.append('total_daily_stats', 'true');

    if (this.formActivityStream$) {
      this.formActivityStream$.unsubscribe();
    }

    if (this.formResponseStream$) {
      this.formResponseStream$.unsubscribe();
    }

    this.formActivityStream$ = this.service.getFormResponseStats(params).subscribe((data: any) => {
      this.loading = false;
      this.activities = {
        never_submitted: data.never_submitted,
        not_submitted_today: data.not_submitted_today,
        unique_submissions_today: data.unique_submissions_today
      };
    });
  }

  registerFilterStates() {
    this.audienceFilter$ = this.store.select(fromStore.selectAudienceFilter).pipe(startWith({}));
    this.dateFilter$ = this.store.select(fromStore.selectDateFilter).pipe(startWith({}));
    const state$ = combineLatest([this.audienceFilter$, this.dateFilter$, this.formFilter$]);

    state$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.audienceFilter = res[0];
      this.dateFilter = res[1];
      this.filters = res[2];
      this.fetchFormResponseStats();
    });
    this.formFilter$.next(this.filters);
  }

  handleClearSelectedForms() {
    this.filters = [];
    this.selectedForms = [];
    if (this.formResponseStream$) {
      this.formResponseStream$.unsubscribe();
    }
    if (this.formActivityStream$) {
      this.formActivityStream$.unsubscribe();
    }
    this.formFilter$.next(this.filters);
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

    this.formFilter$.next(this.filters);
  }

  downloadFormResponse(category) {
    this.downloading = true;
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

    if (category === ExportCategory.SourceApp) {
      params = params.append('collection_method', '1');
    } else if (category === ExportCategory.SourceWeb) {
      params = params.append('collection_method', '2');
    } else {
      params = params.append('category', category);
    }

    this.service.exportFormResponseStats(params).subscribe((data) => {
      this.downloading = false;
      this.utils.exportForms(data, category, this.isPrivacyOn);
    });
  }

  onExportCompleted() {
    this.downloadFormResponse(ExportCategory.CompletedToday);
  }

  onExportNotCompleted() {
    this.downloadFormResponse(ExportCategory.NotCompletedToday);
  }

  onExportNeverCompleted() {
    this.downloadFormResponse(ExportCategory.NeverCompleted);
  }

  onExportSourceApp() {
    this.downloadFormResponse(ExportCategory.SourceApp);
  }

  onExportSourceWeb() {
    this.downloadFormResponse(ExportCategory.SourceWeb);
  }

  buildChartSeries(res) {
    this.sources = {
      tileViews: 0,
      tileCompleted: 0,
      webViews: 0,
      webCompleted: 0
    };

    if (res.length === 0) {
      this.labels = [];
      this.series = [];
      return;
    }

    res.map((item) => {
      if (item.collection_method === 1) {
        this.sources.tileCompleted =
          item.response_completed_epoch > 0
            ? this.sources.tileCompleted + 1
            : this.sources.tileCompleted;
        this.sources.tileViews++;
      } else if (item.collection_method === 2) {
        this.sources.webCompleted =
          item.response_completed_epoch > 0
            ? this.sources.webCompleted + 1
            : this.sources.webCompleted;
        this.sources.webViews++;
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
      { label: [], seriesComplete: [], seriesViews: [] }
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

    const series = [newSeriesViews, newSeriesComplete];
    const data = { labels: labels, series: series };

    this.range = Object.assign({}, this.range, {
      start: data.labels[0],
      end: data.labels[data.labels.length - 1]
    });

    const dataSeries$ = from(this.buildSeriesStream(data));
    dataSeries$.subscribe((series: any) => {
      if (series) {
        this.labels = this.chartUtils.buildLabels(this.divider, this.range, series);
        this.series = series.map((data: number[], idx: number) => {
          return {
            data,
            type: 'line',
            name:
              idx === 0
                ? this.cpI18n.transform('health_dashboard_views')
                : this.cpI18n.transform('health_dashboard_form_graph_completion')
          };
        });
      }
    });
  }

  buildSeriesStream(data) {
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
  }

  handleFormsDataLoad(data: any[]) {
    if (this.formsPageCounter === 1) {
      this.formData = data;
    } else {
      this.formData = this.formData.concat(data);
    }
  }

  ngOnInit(): void {
    this.isPrivacyOn = privacyConfigurationOn(this.session.g);
    this.registerFilterStates();

    const formsSearchSource = this.formsSearchTermStream.pipe(
      map((searchTerm: string) => {
        this.formsSearchTerm = searchTerm;
        this.formsPageCounter = 1;
        this.isFormSearching = searchTerm !== '';
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

    formsSearchCombinedSource.subscribe((data) => this.handleFormsDataLoad(data));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
