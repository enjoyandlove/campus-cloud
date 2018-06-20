import { Component, EventEmitter, Input, OnInit, Output, HostListener } from '@angular/core';

import { isProd } from './../../../config/env';
import { CPTrackingService } from './../../services/tracking.service';

interface IProps {
  text: string;
  class: string;
  disabled?: boolean;
  trackingData?: {
    eventCategory: string;
    eventAction: string;
  };
}

@Component({
  selector: 'cp-button',
  templateUrl: './cp-button.component.html',
  styleUrls: ['./cp-button.component.scss']
})
export class CPButtonComponent implements OnInit {
  @Input() props: IProps;
  @Input() listenForEnterKeyEvent = false;

  @Output() buttonClick: EventEmitter<Event> = new EventEmitter();

  constructor(private track: CPTrackingService) {}

  @HostListener('document:keydown', ['$event'])
  onEnter(event) {
    if (event.keyCode === 13 && !this.props.disabled && this.listenForEnterKeyEvent) {
      this.onClick(event);
    }
  }

  trackGa() {
    const { eventCategory, eventAction } = this.props.trackingData;

    if (isProd) {
      this.track.gaEmitEvent(eventCategory, eventAction);
    }
  }

  disableButton() {
    this.props = Object.assign({}, this.props, { disabled: true });
  }

  onClick(event: Event) {
    this.disableButton();

    if (this.props.trackingData) {
      this.trackGa();
    }

    this.buttonClick.emit(event);
  }

  ngOnInit() {}
}
