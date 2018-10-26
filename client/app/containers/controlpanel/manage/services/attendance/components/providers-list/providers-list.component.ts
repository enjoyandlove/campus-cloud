import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { IService } from '../../../service.interface';
import IServiceProvider from '../../../providers.interface';
import { ServiceAttendance } from '../../../services.status';
import { ProvidersService } from '../../../providers.service';
import { RouteLevel } from '../../../../../../../shared/services';
import { ServicesUtilsService } from '../../../services.utils.service';
import { BaseComponent } from '../../../../../../../base/base.component';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';
import { CPTrackingService } from './../../../../../../../shared/services/tracking.service';
import { CP_TRACK_TO } from './../../../../../../../shared/directives/tracking/tracking.directive';

interface IState {
  end: string;
  start: string;
  search_text: string;
  providers: Array<any>;
  sort_field: string;
  sort_direction: string;
}

const state: IState = {
  end: null,
  start: null,
  providers: [],
  search_text: null,
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

  @Output() hasProviders: EventEmitter<boolean> = new EventEmitter();

  loading;
  eventData;
  sortingLabels;
  eventProperties;
  deleteProvider = '';
  state: IState = state;
  provider: IServiceProvider;
  displayRatingColumn = true;
  showEditProviderModal = false;

  constructor(
    private cpI18n: CPI18nService,
    private utils: ServicesUtilsService,
    private cpTracking: CPTrackingService,
    private providersService: ProvidersService
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

  doSearch(search_text) {
    this.state = {
      ...this.state,
      search_text
    };

    this.fetch();
  }

  doDateFilter(dateRange) {
    this.state = {
      ...this.state,
      end: dateRange.end,
      start: dateRange.start
    };

    this.fetch();
  }

  fetch() {
    const search = new HttpParams()
      .append('end', this.state.end)
      .append('start', this.state.start)
      .append('search_text', this.state.search_text)
      .append('service_id', this.service.id.toString())
      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction);

    super
      .fetchData(this.providersService.getProviders(this.startRange, this.endRange, search))
      .then((res) => {
        this.state = Object.assign({}, this.state, { providers: res.data });
        this.hasProviders.emit(res.data.length > 0);
      });
  }

  onDeleted(providerId) {
    this.state = Object.assign({}, this.state, {
      providers: this.state.providers.filter((provider) => provider.id !== providerId)
    });

    this.hasProviders.emit(this.state.providers.length > 0);
  }

  showEditModal(provider: IServiceProvider) {
    this.provider = provider;
    this.showEditProviderModal = true;

    setTimeout(() => $('#editProvider').modal());
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

  trackDownloadEvent() {
    this.eventProperties = {
      data_type: amplitudeEvents.ASSESSMENT
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_DOWNLOAD_DATA, this.eventProperties);
  }

  trackCheckinEvent(source_id) {
    const eventProperties = {
      source_id,
      check_in_source: amplitudeEvents.ASSESSMENT,
      check_in_type: amplitudeEvents.SERVICE_PROVIDER,
      sub_menu_name: this.cpTracking.activatedRoute(RouteLevel.second)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_CLICKED_WEB_CHECK_IN,
      eventProperties
    );
  }

  downloadProvidersCSV() {
    const search = new HttpParams()
      .append('end', this.state.end)
      .append('start', this.state.start)
      .append('service_id', this.service.id.toString())
      .append('all', '1');

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
    const eventProperties = {
      host_id: this.service.store_id,
      data_source: amplitudeEvents.SERVICE_PROVIDER,
      sub_menu_name: this.cpTracking.activatedRoute(RouteLevel.second)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_DOWNLOAD_DATA,
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
    this.fetch();
    this.trackProviderViewEvent();

    this.sortingLabels = {
      rating: this.cpI18n.translate('ratings'),
      provider_name: this.cpI18n.translate('service_provider')
    };

    this.displayRatingColumn = this.service.service_attendance === ServiceAttendance.enabled;
  }
}
