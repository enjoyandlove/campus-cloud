import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { EventType } from '../../../event.status';
import { isDev } from '../../../../../../../config/env';
import { EventsService } from '../../../events.service';
import { EventUtilService } from '../../../events.utils.service';
import { FileUploadService } from '../../../../../../../shared/services';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-events-excel-modal',
  templateUrl: './events-excel-modal.component.html',
  styleUrls: ['./events-excel-modal.component.scss']
})
export class EventsExcelModalComponent implements OnInit {
  @Input() storeId: number;
  @Input() clubId: number;
  @Input() isClub: boolean;
  @Input() serviceId: number;
  @Input() athleticId: number;
  @Input() isService: boolean;
  @Input() isAthletic: boolean;
  @Input() orientationId: number;
  @Input() isOrientation: boolean;

  options;
  fileName;
  urlPrefix;

  constructor(
    private router: Router,
    private cpI18n: CPI18nService,
    private service: EventsService,
    private utils: EventUtilService,
    private fileService: FileUploadService
  ) {}

  parser(file) {
    const url = !isDev ? '/events/excel' : 'http://localhost:8000/events/excel';

    return this.fileService
      .uploadFile(file, url)
      .toPromise()
      .then((res: any) => {
        this.service.setModalEvents(JSON.parse(res));

        return Promise.resolve();
      })
      .catch((err) => {
        const serverError = err.error.error;

        return Promise.reject(
          serverError ? serverError : this.cpI18n.translate('something_went_wrong')
        );
      });
  }

  getEventType() {
    if (this.isAthletic) {
      return {
        event_type_id: this.clubId,
        event_type: EventType.athletics
      };

    } else if (this.isClub) {
      return {
        event_type_id: this.clubId,
        event_type: EventType.club
      };

    } else if (this.isService) {
      return {
        event_type_id: this.serviceId,
        event_type: EventType.services
      };

    } else if (this.isOrientation) {
      return {
        event_type_id: this.orientationId,
        event_type: EventType.orientation
      };
    } else {
      return { event_type: EventType.event };
    }
  }

  onNavigate() {
    this.urlPrefix = this.utils.buildUrlPrefixExcel(this.getEventType());

    this.router.navigate([this.urlPrefix]);
  }

  ngOnInit() {
    this.fileName = 'mass_event_invite_sample.csv';

    const templateUrl = isDev ? `/templates/${this.fileName}` : `/dist/templates/${this.fileName}`;

    this.options = {
      templateUrl,
      validExtensions: ['csv'],
      parser: this.parser.bind(this)
    };
  }
}
