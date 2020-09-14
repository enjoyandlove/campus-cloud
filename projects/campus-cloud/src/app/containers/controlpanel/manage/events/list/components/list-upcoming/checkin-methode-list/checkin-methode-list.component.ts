import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import IEvent from '@controlpanel/manage/events/event.interface';
import { EventsAmplitudeService } from '@controlpanel/manage/events/events.amplitude.service';
import {
  amplitudeEvents,
  CP_PRIVILEGES_MAP
} from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { EventUtilService } from '@controlpanel/manage/events/events.utils.service';
import { CP_TRACK_TO } from '@campus-cloud/shared/directives';
import { EventAttendance } from '@controlpanel/manage/events/event.status';

@Component({
  selector: 'cp-checkin-methode-list',
  templateUrl: './checkin-methode-list.component.html',
  styleUrls: ['./checkin-methode-list.component.scss']
})
export class CheckinMethodeListComponent implements OnInit {
  @Input() displaySelfCheckIn = true;
  @Input() kioskCheckinLink: string;
  @Input() selfCheckinLink: string;
  @Output() kioskCheckinLinkEvent: EventEmitter<any> = new EventEmitter();
  @Output() selfCheckinLinkEvent: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {

  }
}
