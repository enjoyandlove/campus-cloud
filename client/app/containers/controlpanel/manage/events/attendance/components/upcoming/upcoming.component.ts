/*tslint:disable:max-line-length */
import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { EventAttendance } from '../../../event.status';
import { FORMAT } from '../../../../../../../shared/pipes/date';
import { EventUtilService } from '../../../events.utils.service';
import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CPTrackingService, RouteLevel } from '../../../../../../../shared/services';
import { IResourceBanner } from '../../../../../../../shared/components/cp-resource-banner/cp-resource.interface';

@Component({
  selector: 'cp-attendance-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss']
})
export class AttendanceUpcomingComponent implements OnInit {
  @Input() event: any;
  @Input() isOrientation: boolean;
  @Input() resourceBanner: IResourceBanner;

  banner;
  mapCenter;
  dateFormat;
  eventCheckinRoute;
  draggable = false;
  format = FORMAT.DATETIME;
  showLocationDetails = true;
  attendanceEnabled = EventAttendance.enabled;

  constructor(public utils: EventUtilService, public cpTracking: CPTrackingService) {}

  trackChangeEvent() {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: this.cpTracking.activatedRoute(RouteLevel.fourth)
    };

    return {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CHANGE_BUTTON,
      eventProperties
    };
  }

  ngOnInit() {
    this.eventCheckinRoute = this.utils.getEventCheckInLink(this.isOrientation);
    this.banner = this.event.poster_url === '' ? this.event.store_logo_url : this.event.poster_url;
    this.showLocationDetails = this.event.latitude !== 0 && this.event.longitude !== 0;

    this.dateFormat = FORMAT.DATETIME;
    this.mapCenter = new BehaviorSubject({
      lat: this.event.latitude,
      lng: this.event.longitude
    });

    this.resourceBanner = {
      image: this.banner,
      heading: this.event.title,
      subheading: this.event.store_name
    };
  }
}
