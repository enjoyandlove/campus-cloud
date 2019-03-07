import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { ILocation } from '../../model';
import { CP_TRACK_TO } from '@shared/directives';
import { amplitudeEvents } from '@shared/constants';
import { environment } from '@client/environments/environment';
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
  defaultImage = `${environment.root}public/default/user.png`;

  constructor(
    public cpI18n: CPI18nService,
    public cpTracking: CPTrackingService
  ) {}

  ngOnInit() {
    this.sortingLabels = {
      locations: this.cpI18n.translate('name')
    };

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties: this.cpTracking.getEventProperties()
    };
  }
}
