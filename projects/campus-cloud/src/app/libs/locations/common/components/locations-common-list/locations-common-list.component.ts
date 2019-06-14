import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { ILocation } from '../../model';
import { CP_TRACK_TO } from '@shared/directives';
import { amplitudeEvents } from '@shared/constants';
import { environment } from '@campus-cloud/src/environments/environment';
import { CPI18nService, CPTrackingService } from '@shared/services';

@Component({
  selector: 'cp-locations-common-list',
  templateUrl: './locations-common-list.component.html',
  styleUrls: ['./locations-common-list.component.scss']
})
export class LocationsCommonListComponent implements OnInit {
  @Input() sortBy: string;
  @Input() sortDirection: string;
  @Input() data$: Observable<ILocation[]>;

  @Output() doSort: EventEmitter<string> = new EventEmitter();
  @Output() deleteClick: EventEmitter<ILocation> = new EventEmitter();

  eventData;
  sortingLabels;
  defaultImage = `${environment.root}assets/default/user.png`;

  constructor(private cpI18n: CPI18nService, private cpTracking: CPTrackingService) {}

  ngOnInit() {
    this.sortingLabels = {
      locations: this.cpI18n.translate('name')
    };

    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: amplitudeEvents.INFO
    };

    this.eventData = {
      eventProperties,
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM
    };
  }
}
