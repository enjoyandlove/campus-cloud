import { Component, OnInit } from '@angular/core';

import { LocationsService } from '../locations.service';
import { BaseComponent } from '../../../../../base/base.component';

declare var $: any;

interface IState {
  locations: Array<any>;
}

const state: IState = {
  locations: []
};

@Component({
  selector: 'cp-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss']
})
export class LocationsListComponent extends BaseComponent implements OnInit {
  loading;
  state: IState = state;

  constructor(
    private locationsService: LocationsService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  private fetch() {
    super
      .fetchData(this.locationsService.getLocations())
      .then(res => {
        this.state = Object.assign({}, this.state, { locations: res.data });
      });
  }

  onLaunchModal() {
    $('#locationsCreate').modal();
  }

  onLocationCreated(location) {
    this.state = Object.assign(
      {},
      this.state,
      { locations: [location, ...this.state.locations] }
    );
  }

  ngOnInit() { }
}
