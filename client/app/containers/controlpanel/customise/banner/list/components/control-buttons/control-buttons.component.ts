import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { CPI18nService } from '../../../../../../../shared/services';
import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';

@Component({
  selector: 'cp-banner-control-buttons',
  templateUrl: './control-buttons.component.html',
  styleUrls: ['./control-buttons.component.scss']
})
export class BannerControlButtonsComponent implements OnInit {
  @Output() save: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();

  buttonData;
  savedPhoto;
  canceledPhoto;

  @Input()
  set loading(loading) {
    this.buttonData = { ...this.buttonData, disabled: loading };
  }

  constructor(public cpI18n: CPI18nService) {}

  ngOnInit() {
    this.savedPhoto = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CUSTOMIZE_SAVED_PHOTO
    };

    this.canceledPhoto = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CUSTOMIZE_CANCELED_PHOTO
    };

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('done')
    };
  }
}
