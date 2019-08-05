import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { get as _get } from 'lodash';

import { DEFAULT } from '@campus-cloud/shared/constants';
import { RouteLevel } from '@campus-cloud/shared/services';
import { IService } from '../../../service.interface';
import { BaseComponent } from '@campus-cloud/base/base.component';
import IServiceProvider from '../../../providers.interface';
import { CPI18nService } from '@campus-cloud/shared/services/i18n.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { ProvidersService } from '../../../providers.service';
import { CPTrackingService } from '@campus-cloud/shared/services/tracking.service';
import { ServicesUtilsService } from '../../../services.utils.service';
import { CP_TRACK_TO } from '@campus-cloud/shared/directives/tracking/tracking.directive';
import { IFilterState, ProvidersUtilsService } from '../../../providers.utils.service';
import { AMPLITUDE_INTERVAL_MAP } from '@campus-cloud/containers/controlpanel/assess/engagement/engagement.utils.service';

interface IState {
  providers: Array<IServiceProvider>;
  sort_field: string;
  sort_direction: string;
}

const state: IState = {
  providers: [],
  sort_direction: 'asc',
  sort_field: 'provider_name'
};

@Component({
  selector: 'cp-providers-list',
  templateUrl: './providers-list.component.html',
  styleUrls: ['./providers-list.component.scss']
})
export class ServicesProvidersListComponent extends BaseComponent implements OnInit {
  @Input() service: IService;

  _filterState;
  get filterState(): IFilterState {
    return this._filterState;
  }
  @Input('filterState')
  set filterState(value: IFilterState) {
    this._filterState = value;
    this.fetch();
  }

  @Output() hasProviders: EventEmitter<boolean> = new EventEmitter();

  loading;
  eventData;
  hasRecords;
  sortingLabels;
  eventProperties;
  noProviderMessage;
  deleteProvider = '';
  state: IState = state;
  provider: IServiceProvider;
  noProviderAddProviderMessage;
  showEditProviderModal = false;

  constructor(
    private cpI18n: CPI18nService,
    private utils: ServicesUtilsService,
    private cpTracking: CPTrackingService,
    public providersService: ProvidersService,
    public providerUtils: ProvidersUtilsService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  onPaginationNext() {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetch();
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };
    this.fetch();
  }

  fetch(setHasRecords = false) {
    let search = new HttpParams()
      .append('service_id', this.service.id.toString())
      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction);

    search = this.providerUtils.addSearchParams(search, this.filterState);

    super
      .fetchData(this.providersService.getProviders(this.startRange, this.endRange, search))
      .then((res) => {
        this.state = Object.assign({}, this.state, { providers: res.data });
        this.hasProviders.emit(res.data.length > 0);

        if (setHasRecords) {
          this.hasRecords = res.data.length > 0;
        }
      });
  }

  onDeleted(providerId) {
    this.state = Object.assign({}, this.state, {
      providers: this.state.providers.filter((provider) => provider.id !== providerId)
    });

    this.hasRecords = !!this.state.providers.length;
    this.hasProviders.emit(this.state.providers.length > 0);
  }

  showEditModal(provider: IServiceProvider) {
    this.provider = provider;
    this.showEditProviderModal = true;

    setTimeout(() => $('#editProvider').modal({ keyboard: true, focus: true }));
  }

  onEdited(editedProvider: IServiceProvider) {
    this.provider = null;
    this.showEditProviderModal = false;

    this.state = {
      ...this.state,
      providers: this.state.providers.map((provider) => {
        return provider.id === editedProvider.id ? editedProvider : provider;
      })
    };
  }

  trackCheckinEvent(source_id) {
    const eventProperties = {
      source_id,
      assessment_type: amplitudeEvents.SERVICE_PROVIDER,
      sub_menu_name: this.cpTracking.activatedRoute(RouteLevel.third)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_CC_WEB_CHECK_IN, eventProperties);
  }

  downloadProvidersCSV() {
    let search = new HttpParams().set('service_id', this.service.id.toString()).set('all', '1');

    search = this.providerUtils.addSearchParams(search, this.filterState);

    const stream$ = this.providersService.getProviderAssessments(
      this.startRange,
      this.endRange,
      search
    );

    stream$.toPromise().then((providers: any) => {
      this.utils.exportServiceProvidersAttendees(providers);
      this.trackDownloadProviders();
    });
  }

  trackDownloadProviders() {
    const filter_type = _get(
      this.filterState,
      ['studentFilter', 'cohort_type'],
      amplitudeEvents.ALL_STUDENTS
    );

    const dateType = _get(this.filterState, ['dateRange', 'route_id'], DEFAULT);
    const interval = AMPLITUDE_INTERVAL_MAP[dateType];

    const eventProperties = {
      interval,
      filter_type,
      provider_type: amplitudeEvents.ALL_PROVIDERS,
      sub_menu_name: this.cpTracking.activatedRoute(RouteLevel.second)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_DOWNLOAD_SERVICE_ASSESS_DATA,
      eventProperties
    );
  }

  trackProviderViewEvent() {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: amplitudeEvents.SERVICE_PROVIDER
    };

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties
    };
  }

  ngOnInit() {
    this.fetch(true);
    this.trackProviderViewEvent();

    this.sortingLabels = {
      rating: this.cpI18n.translate('ratings'),
      provider_name: this.cpI18n.translate('service_provider')
    };

    this.noProviderMessage = this.cpI18n.translate('t_services_no_service_provider_found');
    this.noProviderAddProviderMessage = this.cpI18n.translate('services_providers_no_results');
  }
}
