import { Component, OnDestroy, OnInit } from '@angular/core';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { CPSession } from '@campus-cloud/session';
import { ChartsUtilsService } from '@campus-cloud/shared/services';
import { ProvidersService } from '@controlpanel/manage/services/providers.service';

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
import { Observable, of, Subject, merge, combineLatest } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';
import { ServicesUtilsService } from '../../../../manage/services/services.utils.service';

interface ILocationChart {
  hour: string;
  checkins: number;
}
@Component({
  selector: 'cp-health-dashboard-location-view',
  templateUrl: './health-dashboard-location-view.component.html',
  styleUrls: ['./health-dashboard-location-view.component.scss']
})
export class HealthDashboardLocationViewComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  trafficLoading: boolean = false;
  downloading: boolean = false;
  qrCodeSearchTermStream = new Subject();
  qrCodeSearchTerm: string;
  qrCodePageCounter = 1;
  qrCodePageStream = new Subject<number>();
  qrCodePaginationCountPerPage = 10;
  qrCodeHasMorePages = false;
  isQrCodeSearching = false;
  qrCodeData = [];

  selectedQrCode = [];

  locationVisits = {
    total_visit: 0,
    unique_visit: 0
  };

  trafficService$;
  chartService$;

  filters = [];
  providerFilter$ = new Subject<any>();

  audienceFilter$: Observable<Record<number, any>>;
  audienceFilter = null;

  dateFilter$: Observable<Record<number, any>>;
  dateFilter = null;

  sortBy = [];
  selectedSortItem: number = 0;

  locationTraffics = [];

  locationChartData = new Array<ILocationChart>(24).fill({ hour: '', checkins: 0 });
  locationChartData$ = new Subject<any>();

  destroy$ = new Subject();

  constructor(
    public store: Store<{ healthDashboard: fromStore.HealthDashboardState }>,
    public cpI18n: CPI18nPipe,
    public providerService: ProvidersService,
    private session: CPSession,
    public chartUtils: ChartsUtilsService,
    public serviceUtils: ServicesUtilsService
  ) {}

  fetchQrCodes(page): Observable<any[]> {
    let startRecordCount = this.qrCodePaginationCountPerPage * (page - 1) + 1;
    let endRecordCount = this.qrCodePaginationCountPerPage * page + 1;

    let params = new HttpParams()
      .set('school_id', this.session.school.id.toString())
      .set('service_id', this.session.schoolCTServiceId.toString())
      .set('sort_field', 'provider_name')
      .set('sort_direction', 'asc')
      .set(
        'search_text',
        Boolean(this.qrCodeSearchTerm && this.qrCodeSearchTerm.trim().length)
          ? this.qrCodeSearchTerm.trim()
          : null
      );
    return this.providerService.getProviders(startRecordCount, endRecordCount, params).pipe(
      map((results: any[]) => {
        if (results && results.length > this.qrCodePaginationCountPerPage) {
          this.qrCodeHasMorePages = true;
          // Remove the extra record that we fetched to check if we have more records to fetch.
          results = results.splice(0, this.qrCodePaginationCountPerPage);
        } else {
          this.qrCodeHasMorePages = false;
        }
        return results;
      }),
      catchError(() => of([]))
    ) as Observable<any[]>;
  }

  fetchTraffic() {
    let params = new HttpParams()
      .append('school_id', this.session.school.id.toString())
      .append('service_id', this.session.schoolCTServiceId.toString())
      .append('sort_field', this.sortBy[this.selectedSortItem].item)
      .append('sort_direction', 'desc')
      .append('start', this.dateFilter.start)
      .append('end', this.dateFilter.end);
    if (this.filters.length > 0) {
      params = params.append('service_provider_ids', this.filters.join(','));
    }
    if (this.audienceFilter !== null) {
      params = params.append('user_list_id', this.audienceFilter.listId);
    }

    if (this.trafficService$) {
      this.trafficService$.unsubscribe();
    }
    this.trafficService$ = this.providerService
      .getProviders(1, 5, params)
      .pipe(
        map((results: any[]) => {
          this.trafficLoading = false;
          this.loading = false;
          return results;
        }),
        catchError(() => of([]))
      )
      .subscribe((data) => {
        this.locationTraffics = [...data];
      });
  }

  fetchChartSeries() {
    let params = new HttpParams()
      .append('school_id', this.session.school.id.toString())
      .append('service_id', this.session.schoolCTServiceId.toString())
      .append('start', this.dateFilter.start)
      .append('end', this.dateFilter.end)
      .append('all', '1');
    if (this.filters.length > 0) {
      params = params.append('service_provider_ids', this.filters.join(','));
    }
    if (this.audienceFilter !== null) {
      params = params.append('user_list_id', this.audienceFilter.listId);
    }

    if (this.chartService$) {
      this.chartService$.unsubscribe();
    }

    this.chartService$ = this.providerService
      .getProviderAssessments(null, null, params)
      .subscribe((results: any[]) => {
        this.initLocationChart();
        results.map((item) => {
          this.locationChartData[new Date(item.check_in_time_epoch * 1000).getHours()].checkins++;
        });
        this.calculateVisits(results);
        this.fetchTraffic();
      });
  }

  calculateVisits(res: any[]) {
    this.locationVisits.total_visit = 0;
    this.locationVisits.unique_visit = 0;
    this.locationVisits.total_visit = res.length;
    const email = res.filter((item) => item.user_id === 0);
    const users = res.filter((item) => item.user_id !== 0);
    let unique_users = [];
    users.map((item) => {
      if (!unique_users.includes(item.user_id)) {
        unique_users.push(item.user_id);
      }
    });

    let unique_email = [];
    email.map((item) => {
      if (!unique_email.includes(item.email)) {
        unique_email.push(item.email);
      }
    });

    this.locationVisits.unique_visit = unique_email.length + unique_users.length;
  }

  handleQrCode(qrcode: any) {
    const index = this.filters.indexOf(qrcode.id);
    if (index > -1) {
      this.filters.splice(index, 1);
      this.selectedQrCode.splice(this.selectedQrCode.indexOf(qrcode), 1);
    } else {
      this.filters.push(qrcode.id);
      this.selectedQrCode.push(qrcode);
    }
    this.providerFilter$.next(this.filters);
  }

  handleQrCodeDataLoad(data: any[]) {
    if (this.qrCodePageCounter === 1) {
      this.qrCodeData = data;
    } else {
      this.qrCodeData = this.qrCodeData.concat(data);
    }
  }

  qrCodeLoadMoreClickHandler(): void {
    this.qrCodePageCounter++;
    this.qrCodePageStream.next(this.qrCodePageCounter);
  }

  handleClearSelectedQrCode() {
    this.filters = [];
    this.selectedQrCode = [];
    this.providerFilter$.next(this.filters);
  }

  registerFilterStates() {
    this.audienceFilter$ = this.store.select(fromStore.selectAudienceFilter).pipe(startWith({}));
    this.dateFilter$ = this.store.select(fromStore.selectDateFilter).pipe(startWith({}));
    const state$ = combineLatest([this.audienceFilter$, this.dateFilter$, this.providerFilter$]);

    state$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.loading = true;
      this.audienceFilter = res[0];
      this.dateFilter = res[1];
      this.filters = res[2];
      this.fetchChartSeries();
    });

    this.providerFilter$.next(this.filters);
  }

  onSelectSortBy(item) {
    this.trafficLoading = true;
    this.selectedSortItem = item.action;
    this.fetchTraffic();
  }

  downloadProvidersCSV() {
    this.downloading = true;
    let params = new HttpParams()
      .append('school_id', this.session.school.id.toString())
      .append('service_id', this.session.schoolCTServiceId.toString());

    params =
      this.filters.length > 0
        ? params.append('service_provider_ids', this.filters.join(','))
        : params.append('all', '1');

    if (this.audienceFilter !== null) {
      params = params.append('user_list_id', this.audienceFilter.listId);
    }

    if (this.dateFilter !== null) {
      params = params.append('start', this.dateFilter.start).append('end', this.dateFilter.end);
    }

    const stream$ = this.providerService.getProviderAssessments(null, null, params);

    stream$.toPromise().then((providers: any) => {
      this.downloading = false;
      this.serviceUtils.exportServiceProvidersAttendees(providers, true);
    });
  }

  initLocationChart() {
    this.locationChartData = this.locationChartData.map((item, index) => {
      let hour: any = index % 12;
      if (hour === 0) {
        hour = 12;
      }
      if (index < 12) {
        hour = `${hour} AM`;
      } else {
        hour = `${hour} PM`;
      }
      return {
        hour: hour,
        checkins: 0
      };
    });
  }

  ngOnInit(): void {
    this.sortBy = [
      {
        label: this.cpI18n.transform('contact_trace_location_traffic'),
        item: 'total_visits'
      },
      {
        label: this.cpI18n.transform('contact_trace_location_peak_traffic'),
        item: 'peak_hourly_visits'
      }
    ];

    this.registerFilterStates();

    const qrCodeSearchSource = this.qrCodeSearchTermStream.pipe(
      map((searchTerm: string) => {
        this.qrCodeSearchTerm = searchTerm;
        this.qrCodePageCounter = 1;
        this.isQrCodeSearching = searchTerm !== '';
        return { searchTerm: searchTerm, page: this.qrCodePageCounter };
      })
    );

    const qrCodePageSource = this.qrCodePageStream.pipe(
      map((pageNumber) => {
        this.qrCodePageCounter = pageNumber;
        return { searchTerm: this.qrCodeSearchTerm, page: pageNumber };
      })
    );

    const qrCodeSearchCombinedSource: Observable<any[]> = merge(
      qrCodePageSource,
      qrCodeSearchSource
    ).pipe(
      startWith({ searchTerm: this.qrCodeSearchTerm, page: this.qrCodePageCounter }),
      switchMap((params: { searchTerm: string; page: number }) => {
        return this.fetchQrCodes(params.page);
      }),
      share()
    );

    qrCodeSearchCombinedSource.subscribe((data) => this.handleQrCodeDataLoad(data));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
