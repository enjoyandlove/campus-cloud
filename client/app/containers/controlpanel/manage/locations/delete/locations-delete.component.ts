import { Component, OnInit, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { CPSession } from '@app/session';
import { CPTrackingService } from '@shared/services';
import { amplitudeEvents } from '@shared/constants/analytics';
import { LocationModel } from '@containers/controlpanel/manage/locations/model';

declare var $: any;

@Component({
  selector: 'cp-locations-delete',
  templateUrl: './locations-delete.component.html',
  styleUrls: ['./locations-delete.component.scss']
})
export class LocationsDeleteComponent implements OnInit {
  @Input() location: LocationModel;

  eventProperties;

  constructor(
    public session: CPSession,
    public cpTracking: CPTrackingService,
    public store: Store<fromStore.ILocationsState | fromRoot.IHeader>
  ) {}

  onDelete() {
    const locationId = this.location.id;
    const school_id =  this.session.g.get('school').id;
    const params = new HttpParams().set('school_id', school_id);

    const payload = {
      params,
      locationId
    };

    this.store.dispatch(new fromStore.DeleteLocation(payload));
    this.trackEvent();
    $('#locationsDelete').modal('hide');
  }

  trackEvent() {
    this.eventProperties = {
      ...this.eventProperties,
      ...this.cpTracking.getEventProperties()
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.DELETED_ITEM, this.eventProperties);
  }

  ngOnInit() {}
}
