import { Component, OnInit } from '@angular/core';

import { LocationsService } from '../locations.service';
import { BaseComponent } from '../../../../../base/base.component';

declare var $: any;

interface IState {
  locations: Array<any>;
}

const state: IState = {
  locations: [],
};

@Component({
  selector: 'cp-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss'],
})
export class LocationsListComponent extends BaseComponent implements OnInit {
  loading;
  isLocationsCreate;
  deleteLocation = '';
  updateLocation = '';
  state: IState = state;

  constructor(private locationsService: LocationsService) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));

    this.fetch();
  }

  private fetch() {
    super.fetchData(this.locationsService.getLocations()).then((res) => {
      this.state = Object.assign({}, this.state, { locations: res.data });
    });
  }

  onLaunchModal() {
    this.isLocationsCreate = !this.isLocationsCreate;
    setTimeout(
      () => {
        $('#locationsCreate').modal();
      },

      1,
    );
  }

  onLocationCreated(location) {
    this.state = Object.assign({}, this.state, {
      locations: [location, ...this.state.locations],
    });
  }

  onLocationUpdated(location) {
    const _state = Object.assign({}, this.state, {
      locations: this.state.locations.map((_location) => {
        if (_location.id === location.id) {
          return (_location = location.data);
        }

        return _location;
      }),
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

  ngOnInit() {}
}
