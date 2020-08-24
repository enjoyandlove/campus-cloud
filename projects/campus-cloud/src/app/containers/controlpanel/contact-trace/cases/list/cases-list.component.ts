import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { CPTrackingService } from '@campus-cloud/shared/services';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { amplitudeEvents } from '@projects/campus-cloud/src/app/shared/constants';
import { CP_TRACK_TO } from '@projects/campus-cloud/src/app/shared/directives';
import { FORMAT } from '@projects/campus-cloud/src/app/shared/pipes';
import { ICase } from '../cases.interface';
@Component({
  selector: 'cp-cases-list',
  templateUrl: './cases-list.component.html',
  styleUrls: ['./cases-list.component.scss']
})
export class CasesListComponent implements OnInit {
  @Input() data$: Observable<ICase[]>;
  @Output() deleteClick: EventEmitter<ICase> = new EventEmitter();

  eventData;
  dateFormat = FORMAT.SHORT;

  constructor(public cpI18nPipe: CPI18nPipe, public cpTracking: CPTrackingService) {}

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
