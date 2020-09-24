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

@Component({
  selector: 'cp-health-dashboard-location-view',
  templateUrl: './health-dashboard-location-view.component.html',
  styleUrls: ['./health-dashboard-location-view.component.scss']
})
export class HealthDashboardLocationViewComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  qrCodeSearchTermStream = new Subject();
  qrCodeSearchTerm: string;
  qrCodePageCounter = 1;
  qrCodePageStream = new Subject<number>();
  qrCodePaginationCountPerPage = 10;
  qrCodeHasMorePages = false;
  qrCodeData = [];

  selectedQrCode = [];

  locationVisits = {
    total_visit: 0,
    unique_visit: 0,
    repeat_visit: 0
  };

  trafficService$;

  filters = [];
  providerFilter$ = new Subject<any>();

  audienceFilter$: Observable<Record<number, any>>;
  audienceFilter = null;

  dateFilter$: Observable<Record<number, any>>;
  dateFilter = null;

  sortBy = [];
  selectedSortItem: number = 0;

  locationTraffics = [];

  destroy$ = new Subject();

  constructor(
    public store: Store<{ healthDashboard: fromStore.HealthDashboardState }>,
    public cpI18n: CPI18nPipe,
    public providerService: ProvidersService,
    private session: CPSession,
    public chartUtils: ChartsUtilsService
  ) {}

  fetchQrCodes(page): Observable<any[]> {
    let startRecordCount = this.qrCodePaginationCountPerPage * (page - 1) + 1;
    let endRecordCount = this.qrCodePaginationCountPerPage * page + 1;

    let params = new HttpParams()
      .set('school_id', this.session.school.id.toString())
      .set('service_id', this.session.schoolCTServiceId.toString())
      .set('sort_field', 'provider_name')
      .set('sort_direction', 'asc');
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
    this.loading = true;
    let params = new HttpParams()
      .append('school_id', this.session.school.id.toString())
      .append('service_id', this.session.schoolCTServiceId.toString())
      .append('sort_fied', this.sortBy[this.selectedSortItem].item)
      .append('sort_direction', 'desc');
    if (this.filters.length > 0) {
      params = params.append('service_provider_ids', this.filters.join(','));
    }
    if (this.audienceFilter !== null) {
      params = params.append('user_list_id', this.audienceFilter.listId);
    }

    if (this.dateFilter !== null) {
      params = params.append('start', this.dateFilter.start).append('end', this.dateFilter.end);
    }

    if (this.trafficService$) {
      this.trafficService$.unsubscribe();
    }

    this.trafficService$ = this.providerService
      .getProviders(1, 5, params)
      .pipe(
        map((results: any[]) => {
          this.loading = false;
          return results;
        }),
        catchError(() => of([]))
      )
      .subscribe((data) => {
        this.locationTraffics = [...data];
        this.locationTraffics.map((item) => {
          this.locationVisits.total_visit += item.total_visits;
          this.locationVisits.unique_visit += item.unique_visits;
          this.locationVisits.repeat_visit += item.peak_hourly_visits;
        });
      });
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
    this.qrCodeData = [...this.qrCodeData, ...data];
  }

  qrCodeLoadMoreClickHandler(): void {
    this.qrCodePageCounter++;
    this.qrCodePageStream.next(this.qrCodePageCounter);
  }

  handleClearSelectedQrCode() {
    this.filters = [];
    this.selectedQrCode = [];
  }

  registerFilterStates() {
    this.audienceFilter$ = this.store.select(fromStore.selectAudienceFilter).pipe(startWith({}));
    this.dateFilter$ = this.store.select(fromStore.selectDateFilter).pipe(startWith({}));
    const state$ = combineLatest([this.audienceFilter$, this.dateFilter$, this.providerFilter$]);

    state$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.audienceFilter = res[0];
      this.dateFilter = res[1];
      this.filters = res[2];
      this.fetchTraffic();
    });
  }

  onSelectSortBy(item) {
    this.selectedSortItem = item.action;
    this.fetchTraffic();
  }

  ngOnInit(): void {
    this.sortBy = [
      {
        label: this.cpI18n.transform('contact_trace_traffic'),
        item: 'total_visits'
      },
      {
        label: this.cpI18n.transform('contact_trace_peak_traffic'),
        item: 'peak_hourly_visits'
      }
    ];

    this.registerFilterStates();

    const qrCodeSearchSource = this.qrCodeSearchTermStream.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((searchTerm: string) => {
        this.qrCodeSearchTerm = searchTerm;
        this.qrCodePageCounter = 1;
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
