/* tslint:disable:quotemark */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import ICheckIn from '../checkin.interface';
import { CheckinUtilsService } from '../checkin.utils.service';
import { CPTrackingService } from '../../../../shared/services';
import { amplitudeEvents } from '../../../../shared/constants/analytics';

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

declare var $;

@Component({
  selector: 'cp-base-checkin',
  templateUrl: './base-checkin.component.html',
  styleUrls: ['./base-checkin.component.scss']
})
export class BaseCheckinComponent implements OnInit {
  @Input() data: any;
  @Input() eventId: number;
  @Input() serviceId: number;
  @Input() isEvent: boolean;
  @Input() isService: boolean;
  @Input() isOrientation: boolean;
  @Output() send: EventEmitter<any> = new EventEmitter();
  @Output() checkout: EventEmitter<ICheckIn> = new EventEmitter();

  isInternal;
  isDownload;
  checkInSource;

  constructor(
    private route: ActivatedRoute,
    private utils: CheckinUtilsService,
    private cpTracking: CPTrackingService
  ) {
    this.checkInSource = this.route.snapshot.queryParams['source'];
    this.isInternal = 'edit' in this.route.snapshot.queryParams;
    this.isDownload = 'download' in this.route.snapshot.queryParams;

    if (this.isInternal) {
      setTimeout(
        () => {
          $('#checkinInternalModal').modal();
        },

        1
      );
    }
  }

  onInternalModalTeardown() {
    $('#checkinInternalModal').modal('hide');
  }

  updateState(key, val): void {
    this.data = Object.assign({}, this.data, { [key]: val });
  }

  onInternaleModalUpdate(updatedData) {
    Object.keys(updatedData).forEach((key) => {
      this.updateState(key, updatedData[key]);
    });
  }

  handlePdf() {
    const doc = new jsPDF();

    const imageFormat = decodeURIComponent(this.data.qr_img_base64)
      .split(',')[0]
      .split('/')[1]
      .split(';')[0]
      .toUpperCase();

    try {
      this.trackDownloadQRCodeEvent();
      doc.addImage(decodeURIComponent(this.data.qr_img_base64), imageFormat, 60, 60, 90, 90);
    } catch (error) {
      throw new Error(error);
    }

    doc.setFontSize(this.getPDFTitleFontSize());
    doc.setFontType('bold');
    doc.setFont('helvetica');

    if (this.isService) {
      {
        const fontSize = this.getPDFTitleFontSize();
        doc.setFontSize(fontSize);
        const textHeight = PAGE_HEIGHT - 130;
        const text = <Array<string>>doc.splitTextToSize(this.data.service_name, fullWidth);

        text.forEach((line, index) => {
          doc.text(line, 105, textHeight + index * (fontSize * CENTIMETER), 'center');
        });
      }
    }

    if (this.isEvent) {
      {
        const fontSize = this.getPDFTitleFontSize();
        doc.setFontSize(fontSize);
        const textHeight = PAGE_HEIGHT - 130;
        const text = <Array<string>>doc.splitTextToSize(this.data.title, fullWidth);

        text.forEach((line, index) => {
          doc.text(line, 105, textHeight + index * (fontSize * CENTIMETER), 'center');
        });
      }
    }

    if (this.isService) {
      doc.setFontSize(34);
      doc.setFontType('normal');
      {
        const textHeight = PAGE_HEIGHT - 80;
        const text = doc.splitTextToSize(this.data.provider_name, fullWidth);
        text.forEach((line, index) => {
          doc.text(line, 105, textHeight + index * (CENTIMETER * 34), 'center');
        });
      }
    }

    doc.rect(LEFT_MARGIN, PAGE_HEIGHT - 50, fullWidth, 0.1);

    doc.setDrawColor(255, 0, 0);
    doc.setFillColor(255, 0, 0);

    const appLogoFormat = decodeURIComponent(this.data.app_logo_img_base64)
      .split(',')[0]
      .split('/')[1]
      .split(';')[0]
      .toUpperCase();

    doc.addImage(
      decodeURIComponent(this.data.app_logo_img_base64),
      appLogoFormat,
      LEFT_MARGIN,
      PAGE_HEIGHT - 43,
      THUMB_HEIGHT,
      THUMB_WIDTH
    );

    doc.setFontSize(20);

    const pageOneFooter = doc.splitTextToSize('Scan and provide feedback on the', 130);

    doc.text(65, PAGE_HEIGHT - 30, pageOneFooter);
    doc.text(65, PAGE_HEIGHT - 20, `${this.data.school_name} App`);

    doc.setFontSize(16);

    doc.addPage();

    doc.rect(0, 0, 300, 60, 'FD');

    doc.setFontSize(30);
    doc.setFontType('bold');
    doc.setTextColor(255, 255, 255);

    doc.text('Give Feedback', 105, 28, 'center');

    if (this.isService) {
      doc.text(
        LEFT_MARGIN + 13,
        40,
        doc.splitTextToSize('with Service Assessment', PAGE_WIDTH - LEFT_MARGIN)
      );
    }

    if (this.isEvent) {
      doc.text(
        LEFT_MARGIN + 18,
        40,
        doc.splitTextToSize('with Event Assessment', PAGE_WIDTH - LEFT_MARGIN)
      );
    }

    doc.setFontSize(20);
    doc.setFontType('normal');
    doc.setFontStyle('italic');
    doc.setTextColor(0, 0, 0);
    doc.text(LEFT_MARGIN, 95, doc.splitTextToSize('Student Scan Instructions', 100));

    doc.addImage(
      decodeURIComponent(this.data.app_logo_img_base64),
      appLogoFormat,
      LEFT_MARGIN,
      110,
      THUMB_HEIGHT,
      THUMB_WIDTH
    );

    doc.setFontSize(26);
    doc.setFontType('bold');
    doc.text(65, 123, doc.splitTextToSize('Open App', 120));
    doc.setFontSize(18);
    doc.setFontType('normal');
    doc.text(65, 133, doc.splitTextToSize("Download it if you don't have it", 160));

    doc.addImage(TAP_IMAGE, 'PNG', LEFT_MARGIN, 160, THUMB_HEIGHT, THUMB_WIDTH);
    doc.setFontSize(26);
    doc.setFontType('bold');
    doc.text(65, 173, doc.splitTextToSize('Tap Scan', 120));

    doc.setFontSize(18);
    doc.setFontType('normal');
    doc.text(65, 183, doc.splitTextToSize('Scan the QR Code', 160));

    doc.rect(LEFT_MARGIN, PAGE_HEIGHT - 40, fullWidth, 0.1);

    const feedbackText = 'View Feedback on your Campus Cloud Dashboard';
    const pageTwoFooter = doc.splitTextToSize(feedbackText, fullWidth);

    doc.text(pageTwoFooter, 105, PAGE_HEIGHT - 20, 'center');

    doc.save(`${this.getFileName()}_kit.pdf`);
  }

  getPDFTitleFontSize() {
    const name = this.isService ? this.data.service_name : this.data.title;

    if (name.length < 15) {
      return 50;
    } else if (name.length < 30) {
      return 40;
    } else if (name.length < 50) {
      return 30;
    }

    return 22;
  }

  getFileName() {
    const name = this.isService ? this.data.service_name : this.data.title;

    return name
      .toLowerCase()
      .split(' ')
      .join('_');
  }

  trackDownloadQRCodeEvent() {
    const check_in_type = this.checkInSource
      ? this.utils.getCheckInSource(this.checkInSource)
      : amplitudeEvents.SERVICE_PROVIDER;

    const eventProperties = {
      check_in_type,
      access_type: amplitudeEvents.LOADED_CHECK_IN,
      source_id: this.serviceId ? this.serviceId : this.eventId
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_DOWNLOADED_QR_CODE,
      eventProperties
    );
  }

  ngOnInit() {
    if (!this.isEvent && !this.isService) {
      console.warn('BaseCheckinComponent requires an isEvent or isService input');

      return;
    }

    if (this.isDownload) {
      this.handlePdf();
    }
  }
}
