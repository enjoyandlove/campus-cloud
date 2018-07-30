import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { CPSession } from './../../../../../session';
import { LocationsService } from '../locations.service';
import { BaseComponent } from '../../../../../base/base.component';
import { CP_TRACK_TO } from '../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '../../../../../shared/services';

declare var $: any;

interface IState {
  locations: Array<any>;
  search_str: string;
  sort_field: string;
  sort_direction: string;
}

const state: IState = {
  locations: [],
  search_str: null,
  sort_field: 'name',
  sort_direction: 'asc'
};

@Component({
  selector: 'cp-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss']
})
export class LocationsListComponent extends BaseComponent implements OnInit {
  loading;
  sortingLabels;
  isLocationsCreate;
  deleteLocation = '';
  updateLocation = '';
  state: IState = state;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public cpTracking: CPTrackingService,
    private locationsService: LocationsService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));

    this.fetch();
  }

  private fetch() {
    const search = new HttpParams()
      .append('search_str', this.state.search_str)
      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction)
      .append('school_id', this.session.g.get('school').id);

    const stream$ = this.locationsService.getLocations(this.startRange, this.endRange, search);

    super.fetchData(stream$).then((res) => {
      this.state = Object.assign({}, this.state, { locations: res.data });
    });
  }

  onPaginationNext() {
    super.goToNext();

    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();

    this.fetch();
  }

  onSearch(search_str) {
    this.state = Object.assign({}, this.state, { search_str });

    this.resetPagination();

    this.fetch();
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };

    this.fetch();
  }

  onLaunchModal() {
    this.isLocationsCreate = true;
    setTimeout(
      () => {
        $('#locationsCreate').modal();
      },

      1
    );
  }

  onLocationCreated(location) {
    this.state = Object.assign({}, this.state, {
      locations: [location, ...this.state.locations]
    });
  }

  onLocationUpdated(editedLocation) {
    this.state = {
      ...this.state,
      locations: this.state.locations.map(
        (location) => (location.id === editedLocation.id ? editedLocation : location)
      )
    };
  }

  onLocationDeleted(locationId) {
    this.state = {
      ...this.state,
      locations: this.state.locations.filter((location) => location.id !== locationId)
    };
  }

  trackViewEvent() {
    return {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties: this.cpTracking.getEventProperties()
    };
  }

  ngOnInit() {
    this.sortingLabels = {
      locations: this.cpI18n.translate('locations')
    };
  }
}
