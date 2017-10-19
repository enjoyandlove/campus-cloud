import { Directive, Input, HostListener } from '@angular/core';

import { CPTrackingService } from './../../services/tracking.service';

export const CP_TRACK_TO = {
  'GA': 'ga',
  'AMPLITUDE': 'am'
}

interface IEventData {
  type: string;
  eventAction: string;
  eventCategory: string;
}

@Directive({
  selector: '[cpTracker]',
  providers: [ CPTrackingService ]
})
export class CPTrackerDirective {
  @Input() eventData: IEventData;

  constructor(
    public cpTracker: CPTrackingService
  ) { }

  @HostListener('click') onclick() {
    console.log(this.eventData);

    if (this.eventData.type === CP_TRACK_TO.GA) {
      this.emitGA();
    }

    if (this.eventData.type === CP_TRACK_TO.AMPLITUDE) {
      this.emitAmplitude();
    }
  }

  emitGA() {
    this.cpTracker.gaEmitEvent(this.eventData.eventAction, this.eventData.eventCategory);
  }

  emitAmplitude() {
    console.log('emitting amplitude');
  }
}
