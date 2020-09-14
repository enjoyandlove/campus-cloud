import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { ISnackbar } from '@campus-cloud/store';
import { CPSession } from '@campus-cloud/session';
import { EnvService } from '@campus-cloud/config/env';
import { EventsService } from '../../../events.service';
import { EventsComponent } from '../../../list/base/events.component';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import { FileUploadService, CPI18nService, ModalService } from '@campus-cloud/shared/services';
import { EventUtilService } from '@controlpanel/manage/events/events.utils.service';

@Component({
  selector: 'cp-events-excel-modal',
  templateUrl: './events-excel-modal.component.html',
  styleUrls: ['./events-excel-modal.component.scss']
})
export class EventsExcelModalComponent extends EventsComponent implements OnInit {
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
    private env: EnvService,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: EventsService,
    public store: Store<ISnackbar>,
    private utils: EventUtilService,
    public modalService: ModalService,
    private fileService: FileUploadService
  ) {
    super(session, cpI18n, service, modalService, store);
  }

  parser(file) {
    const url =
      this.env.name !== 'development' ? '/events/excel' : 'http://localhost:8000/events/excel';

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

  onNavigate() {
    this.urlPrefix = this.utils.buildUrlPrefixExcel(this.getEventType());

    this.router.navigate([this.urlPrefix]);
  }

  ngOnInit() {
    this.fileName = 'mass_event_invite_sample.csv';

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
