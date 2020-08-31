import { Input, OnInit, Component } from '@angular/core';
import { ICase } from '../../../cases.interface';
import { CP_TRACK_TO } from '@campus-cloud/shared/directives';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'cp-case-event-view-modal',
  templateUrl: './case-event-view.component.html',
  styleUrls: ['./case-event-view.component.scss']
})
export class CaseEventViewComponent implements OnInit {
  @Input() cases: ICase[];
  @Input() loading: boolean;

  eventData;

  constructor(public cpTracking: CPTrackingService, private router: Router) {}

  resetModal() {
    $('#viewEvent').modal('hide');
  }

  onClicked(caseId) {
    this.resetModal();
    this.router.navigate([`contact-trace/cases/${caseId}`]);
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
