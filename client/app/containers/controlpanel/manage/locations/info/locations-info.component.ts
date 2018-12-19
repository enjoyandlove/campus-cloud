import { OnInit, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import { ILocation } from '../model';
import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { LocationsUtilsService } from '../locations.utils';

@Component({
  selector: 'cp-locations-info',
  templateUrl: './locations-info.component.html',
  styleUrls: ['./locations-info.component.scss']
})
export class LocationsInfoComponent implements OnInit {
  loading$;
  resourceBanner;
  draggable = false;
  location: ILocation;
  mapCenter: BehaviorSubject<any>;

  constructor(public store: Store<fromStore.ILocationsState | fromRoot.IHeader>) {}

  getDayLabel(day) {
    return LocationsUtilsService.getScheduleLabel(day);
  }

  getTimeLabel(time) {
    return LocationsUtilsService.getLocationTiming().find((t) => t.value === time);
  }

  buildHeader(location: ILocation) {
    this.store.dispatch({
      type: fromRoot.baseActions.HEADER_UPDATE,
      payload: {
        heading: `[NOTRANSLATE]${location.name}[NOTRANSLATE]`,
        subheading: null,
        em: null,
        children: [],
        crumbs: {
          label: 'locations',
          url: '/manage/locations'
        }
      }
    });
  }

  loadLocationDetail() {
    this.loading$ = this.store.select(fromStore.getLocationsLoading);
    this.store.select(fromStore.getSelectedLocation)
      .subscribe((location: ILocation) => {
        if (location) {
          this.location = location;
          this.buildHeader(location);

          this.resourceBanner = {
            heading: location.name,
            image: location.image_url,
            subheading: 'Cafe'
          };

          this.mapCenter = new BehaviorSubject({
            lat: location.latitude,
            lng: location.longitude
          });
        }
      });
  }

  ngOnInit() {
    this.loadLocationDetail();
  }

}
