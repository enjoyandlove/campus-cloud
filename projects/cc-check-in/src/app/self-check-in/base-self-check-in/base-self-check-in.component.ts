import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import ICheckIn
  from '@campus-cloud/containers/callback/checkin/checkin.interface';
import { LayoutAlign, LayoutWidth } from '@campus-cloud/layouts/interfaces';
import { ActivatedRoute } from '@angular/router';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { CheckinUtilsService } from '@campus-cloud/containers/callback/checkin/checkin.utils.service';
import {
  CPI18nService,
  CPTrackingService
} from '@campus-cloud/shared/services';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CheckInFormStatus } from '@projects/cc-check-in/src/app/self-check-in/self-check-in.models';
import { SelfCheckInUtils } from '@projects/cc-check-in/src/app/self-check-in/services/self-check-in-utils';

const jsPDF = require('jspdf');

const LEFT_MARGIN = 30;
const PAGE_WIDTH = 210;
const THUMB_WIDTH = 30;
const THUMB_HEIGHT = 30;
const PAGE_HEIGHT = 296;
const CENTIMETER = 0.352778;
const fullWidth = PAGE_WIDTH - LEFT_MARGIN * 2;
const TAP_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg\
AAAEgAAABICAYAAABV7bNHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlY\
WR5ccllPAAAAMFJREFUeNrs3FEKgjAAgOFNvEE36Bg+6c26WT55DG/gGWwTRgVW\
BBkW3weiT4K/82XMxcOxmcN2umkc+vAl6VnadDp/8p5V4KlYRlB601GOu9E4G0E+\
MYEEEkgggQQSCIEEEkgggQQSSCAEek+djl6GVboAAACwT3kB1UmGx0x3AAAAwK/J\
0x3LH3rTOHRyXJUuebqjlWPV0sX6oBcEEkgggQQSSCCBBEIggQQSSCCBBBKIG3W5\
2Gg3PLvg/buLAAMAlisbiA86/YUAAAAASUVORK5CYII=';

@Component({
  selector: 'check-base-self-check-in',
  templateUrl: './base-self-check-in.component.html',
  styleUrls: ['./base-self-check-in.component.scss']
})
export class BaseSelfCheckInComponent implements OnInit {

  @Input() data: any;
  @Input() eventId: number;
  @Input() isEvent: boolean;
  @Input() timeZone: string;
  @Input() serviceId: number;
  @Input() isService: boolean;
  @Input() isOrientation: boolean;
  @Input() checkInFormStatus: CheckInFormStatus;
  @Output() send: EventEmitter<any> = new EventEmitter();

  isInternal;
  isDownload;
  checkInSource;
  layoutWidth = LayoutWidth.third;
  layoutAlign = LayoutAlign.center;
  @Input() clientConfig: any = {};

  constructor() {}

  ngOnInit() {
    if (!this.isEvent && !this.isService) {
      console.warn('BaseCheckinComponent requires an isEvent or isService input');

      return;
    }
  }

  displayQR() {
    return SelfCheckInUtils.displayQR(this.checkInFormStatus);
  }

  displayForm() {
    return SelfCheckInUtils.displayForm(this.checkInFormStatus);
  }

  isSubmittedSuccessfully() {
    return SelfCheckInUtils.isSubmittedSuccessfully(this.checkInFormStatus);
  }

  isNotAvailable() {
    return SelfCheckInUtils.isNotAvailable(this.checkInFormStatus);
  }

  onlyDeepLinkByApp() {
    return SelfCheckInUtils.onlyDeepLinkByAppIsAvailable(this.checkInFormStatus);
  }
}
