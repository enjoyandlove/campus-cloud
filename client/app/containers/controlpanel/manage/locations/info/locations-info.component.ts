import { OnInit, Component, OnDestroy } from '@angular/core';
import { map, filter, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { Destroyable, Mixin } from '@shared/mixins';
import { ILocation } from '@libs/locations/common/model';

@Mixin([Destroyable])

@Component({
  selector: 'cp-locations-info',
  templateUrl: './locations-info.component.html',
  styleUrls: ['./locations-info.component.scss']
})
export class LocationsInfoComponent implements OnInit, OnDestroy, Destroyable {
  loading$;
  resourceBanner;
  draggable = false;
  location: ILocation;
  mapCenter: BehaviorSubject<any>;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(public store: Store<fromStore.ILocationsState | fromRoot.IHeader>) {}

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
    this.store.select(fromStore.getSelectedLocation).pipe(
      takeUntil(this.destroy$),
      filter((location: ILocation) => !!location),
      map((location: ILocation) => {
        this.location = location;
        this.buildHeader(location);

        this.resourceBanner = {
          heading: location.name,
          image: location.image_url,
          subheading: location.category_name
        };

        this.mapCenter = new BehaviorSubject({
          lat: location.latitude,
          lng: location.longitude
        });
      })
    ).subscribe();
  }

  ngOnInit() {
    this.loading$ = this.store.select(fromStore.getLocationsLoading);

    this.loadLocationDetail();
  }

  ngOnDestroy() {
   this.emitDestroy();
  }
}
