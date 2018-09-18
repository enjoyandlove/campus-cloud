import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { ServiceFeedback } from '../../../services.status';
import { ProvidersService } from '../../../providers.service';
import { ServicesUtilsService } from '../../../services.utils.service';
import { BaseComponent } from '../../../../../../../base/base.component';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';
import { CPTrackingService } from './../../../../../../../shared/services/tracking.service';
import { CP_TRACK_TO } from './../../../../../../../shared/directives/tracking/tracking.directive';

interface IState {
  search_text: string;
  providers: Array<any>;
  sort_field: string;
  sort_direction: string;
}

const state: IState = {
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
  @Input() service;

  @Output() hasProviders: EventEmitter<boolean> = new EventEmitter();

  loading;
  eventData;
  sortingLabels;
  eventProperties;
  deleteProvider = '';
  state: IState = state;
  displayRatingColumn = true;

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

  fetch() {
    const search = new HttpParams()
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

  trackDownloadEvent() {
    this.eventProperties = {
      data_type: amplitudeEvents.ASSESSMENT
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_DOWNLOAD_DATA, this.eventProperties);
  }

  trackCheckinEvent(service_id) {
    const eventProperties = {
      service_id,
      source_page: amplitudeEvents.SERVICE
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_CLICKED_CHECKIN, eventProperties);
  }

  downloadProvidersCSV() {
    const search = new HttpParams()
      .append('service_id', this.service.id.toString())
      .append('all', '1');

    const stream$ = this.providersService.getProviders(this.startRange, this.endRange, search);

    stream$.toPromise().then((providers: any) => this.utils.exportServiceProviders(providers));
  }

  trackProviderViewEvent() {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: amplitudeEvents.PROVIDER
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
      rating: this.cpI18n.translate('rating'),
      provider_name: this.cpI18n.translate('service_provider')
    };

    this.displayRatingColumn = this.service.enable_feedback === ServiceFeedback.enabled;
  }
}
