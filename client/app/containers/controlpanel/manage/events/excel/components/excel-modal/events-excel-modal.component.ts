import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { isDev } from '../../../../../../../config/env';
import { EventsService } from '../../../events.service';
import { STATUS } from '../../../../../../../shared/constants';
import { FileUploadService } from '../../../../../../../shared/services';


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
  @Input() isService: boolean;

  options;
  fileName;

  constructor(
    private router: Router,
    private service: EventsService,
    private fileService: FileUploadService,
  ) { }

  parser(file) {
    const url = !isDev ? '/events/excel' : 'http://localhost:8000/events/excel';
    return this
      .fileService
      .uploadFile(file, url)
      .toPromise()
      .then(
      res => {
        this.service.setModalEvents(JSON.parse(res));
        return Promise.resolve();
      }
      )
      .catch(
      err => {
        let serverError = err.json().error;
        return Promise.reject(serverError ? serverError : STATUS.SOMETHING_WENT_WRONG);
      }
      );
  }

  onNavigate() {
    if (this.isService) {
      this.router.navigate([`/manage/services/${this.serviceId}/events/import/excel`]);
      return;
    }

    if (this.isClub) {
      this.router.navigate([`/manage/clubs/${this.clubId}/events/import/excel`]);
      return;
    }

    this.router.navigate(['/manage/events/import/excel']);
  }

  ngOnInit() {
    this.fileName = 'mass_event_invite_sample.xlsx';

    let templateUrl = isDev ? `/templates/${this.fileName}` : `/dist/templates/${this.fileName}`;

    this.options = {
      templateUrl,
      validExtensions: ['xlsx'],
      parser: this.parser.bind(this)
    };
  }
}
