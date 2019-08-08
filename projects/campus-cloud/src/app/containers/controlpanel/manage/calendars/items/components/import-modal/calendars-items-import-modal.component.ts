import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { EnvService } from '@campus-cloud/config/env';
import { CalendarsService } from '../../../calendars.services';
import { FileUploadService, CPI18nService } from '@campus-cloud/shared/services';
import { environment } from '@projects/campus-cloud/src/environments/environment';

@Component({
  selector: 'cp-calendars-items-import-modal',
  templateUrl: './calendars-items-import-modal.component.html',
  styleUrls: ['./calendars-items-import-modal.component.scss']
})
export class CalendarsItemsImportModalComponent implements OnInit {
  options;
  fileName;
  calendarId: number;

  constructor(
    private router: Router,
    private env: EnvService,
    public route: ActivatedRoute,
    private cpI18n: CPI18nService,
    private service: CalendarsService,
    private fileService: FileUploadService
  ) {
    this.calendarId = this.route.snapshot.params['calendarId'];
  }

  parser(file) {
    const url =
      this.env.name !== 'development'
        ? '/calendars/items/import'
        : 'http://localhost:8000/calendars/items/import';

    return this.fileService
      .uploadFile(file, url)
      .toPromise()
      .then((res: any) => {
        this.service.setItems(res);

        return Promise.resolve();
      })
      .catch((err) => {
        const serverError = err.error.error;

        return Promise.reject(
          serverError ? serverError : this.cpI18n.translate('something_went_wrong')
        );
      });
  }

  onSuccess() {
    this.router.navigate([`/manage/calendars/${this.calendarId}/items/import`]);
  }

  ngOnInit() {
    this.fileName = 'mass_calendar_item_invite_sample.csv';

    const templateUrl =
      this.env.name === 'development'
        ? `/assets/templates/${this.fileName}`
        : `${environment.root}assets/templates/${this.fileName}`;

    this.options = {
      templateUrl,
      validExtensions: ['csv'],
      parser: this.parser.bind(this)
    };
  }
}
