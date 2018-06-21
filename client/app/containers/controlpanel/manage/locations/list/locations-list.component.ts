import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { CPSession } from './../../../../../session';
import { LocationsService } from '../locations.service';
import { CPI18nService } from '../../../../../shared/services';
import { BaseComponent } from '../../../../../base/base.component';

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
    private locationsService: LocationsService,
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

  onLocationUpdated(location) {
    const _state = Object.assign({}, this.state, {
      locations: this.state.locations.map((_location) => {
        if (_location.id === location.id) {
          return (_location = location.data);
        }

        return _location;
      })
    });

    this.state = Object.assign({}, this.state, _state);
  }

  onLocationDeleted(locationId) {
    const _state = Object.assign({}, this.state);

    _state.locations = _state.locations.filter((locations) => {
      if (locations.id !== locationId) {
        return locations;
      }
    });

    this.state = Object.assign({}, this.state, { locations: _state.locations });
  }

  ngOnInit() {
    this.sortingLabels = {
      locations: this.cpI18n.translate('locations')
    };
  }
}
