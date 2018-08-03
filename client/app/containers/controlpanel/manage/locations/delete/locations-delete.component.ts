import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { CPSession } from './../../../../../session';
import { LocationsService } from '../locations.service';
import { CPTrackingService } from '../../../../../shared/services';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';

declare var $: any;

@Component({
  selector: 'cp-locations-delete',
  templateUrl: './locations-delete.component.html',
  styleUrls: ['./locations-delete.component.scss']
})
export class LocationsDeleteComponent implements OnInit {
  @Input() location: any;
  @Output() locationDeleted: EventEmitter<number> = new EventEmitter();

  eventProperties;

  constructor(
    public session: CPSession,
    public service: LocationsService,
    public cpTracking: CPTrackingService
  ) {}

  onDelete() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);
    this.service.deleteLocationById(this.location.id, search).subscribe((_) => {
      this.trackEvent();
      this.locationDeleted.emit(this.location.id);
      $('#locationsDelete').modal('hide');
    });
  }

  trackEvent() {
    this.eventProperties = {
      ...this.eventProperties,
      ...this.cpTracking.getEventProperties()
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.DELETED_ITEM,
      this.eventProperties);
  }

  ngOnInit() {}
}
