import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '../../../../../../../shared/services';

@Component({
  selector: 'cp-providers-action-box',
  templateUrl: './providers-action-box.component.html',
  styleUrls: ['./providers-action-box.component.scss']
})
export class ServicesProviderActionBoxComponent implements OnInit {
  @Input() noProviders;

  @Output() download: EventEmitter<null> = new EventEmitter();
  @Output() search: EventEmitter<null> = new EventEmitter();
  @Output() launchAddProviderModal: EventEmitter<null> = new EventEmitter();

  eventData;

  constructor(
    public cpI18n: CPI18nService,
    public cpTracking: CPTrackingService
  ) {}

  onDownload() {
    this.download.emit();
  }

  onLaunchProviderAdd() {
    this.launchAddProviderModal.emit();
  }

  onSearch(query) {
    this.search.emit(query);
  }

  trackAddProvider() {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: amplitudeEvents.ASSESSMENT
    };

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CHANGE_BUTTON,
      eventProperties
    };
  }

  ngOnInit() {
    this.trackAddProvider();
  }
}
