import { Directive, HostListener, Input } from '@angular/core';

import { isProd } from './../../../config/env';
import { CPTrackingService } from './../../services/tracking.service';

export const CP_TRACK_TO = {
  GA: 'ga',
  AMPLITUDE: 'am',
};

export interface IEventData {
  type: string;
  eventAction: string;
  eventCategory: string;
  eventLabel?: string;
}

@Directive({
  selector: '[cpTracker]',
  providers: [CPTrackingService],
})
export class CPTrackerDirective {
  @Input() eventData: IEventData;

  constructor(public cpTracker: CPTrackingService) {}

  @HostListener('click')
  onclick() {
    if (this.eventData.type === CP_TRACK_TO.GA) {
      this.emitGA();
    }

    if (this.eventData.type === CP_TRACK_TO.AMPLITUDE) {
      this.emitAmplitude();
    }
  }

  emitGA() {
    if (isProd) {
      this.cpTracker.gaEmitEvent(
        this.eventData.eventAction,
        this.eventData.eventCategory,
        this.eventData.eventLabel,
      );
    }
  }

  emitAmplitude() {
    // console.log('emitting amplitude');
  }
}
