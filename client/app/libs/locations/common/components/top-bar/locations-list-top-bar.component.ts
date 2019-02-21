import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { IItem } from '@shared/components';
import { CP_TRACK_TO } from '@shared/directives';
import { amplitudeEvents } from '@shared/constants';
import { CPTrackingService } from '@shared/services';

@Component({
  selector: 'cp-locations-list-top-bar',
  templateUrl: './locations-list-top-bar.component.html',
  styleUrls: ['./locations-list-top-bar.component.scss']
})
export class LocationsListTopBarComponent implements OnInit {
  @Input() createLocationLabel: string;
  @Input() categories$: Observable<IItem[]>;

  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() selectedCategory: EventEmitter<number> = new EventEmitter();

  eventData;

  constructor(private cpTracking: CPTrackingService) {}

  onSearch(query) {
    this.search.emit(query);
  }

  onSelectedCategory(category) {
    this.selectedCategory.emit(category.action);
  }

  ngOnInit() {
    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CREATE_ITEM,
      eventProperties: this.cpTracking.getEventProperties()
    };
  }
}
