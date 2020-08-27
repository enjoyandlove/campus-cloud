import { Input, OnInit, Component } from '@angular/core';
import { ICase } from '../../../cases.interface';
import { CP_TRACK_TO } from '@campus-cloud/shared/directives';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { CPTrackingService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-case-event-view-modal',
  templateUrl: './case-event-view.component.html',
  styleUrls: ['./case-event-view.component.scss']
})
export class CaseEventViewComponent implements OnInit {
  @Input() cases: ICase[];
  @Input() loading: boolean;

  eventData;

  constructor(public cpTracking: CPTrackingService) {}

  resetModal() {
    $('#viewEvent').modal('hide');
  }

  ngOnInit() {
    const eventProperties = {
      ...this.cpTracking.getAmplitudeMenuProperties(),
      page_name: amplitudeEvents.INFO
    };

    this.eventData = {
      eventProperties,
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM
    };
  }
}
