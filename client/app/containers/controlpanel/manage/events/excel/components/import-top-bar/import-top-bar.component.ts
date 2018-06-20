import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { API } from '../../../../../../../config/api';
import { EventsService } from '../../../events.service';
import { appStorage } from '../../../../../../../shared/utils';
import { CPI18nService, FileUploadService } from '../../../../../../../shared/services';

@Component({
  selector: 'cp-import-top-bar',
  templateUrl: './import-top-bar.component.html',
  styleUrls: ['./import-top-bar.component.scss']
})
export class EventsImportTopBarComponent implements OnInit {
  @Input() storeId: number;
  @Input() props: any;
  @Input() clubId: number;
  @Input() isClub: boolean;
  @Input() serviceId: number;
  @Input() isService: boolean;
  @Input() isChecked: boolean;
  @Input() isOrientation: boolean;

  @Output() bulkChange: EventEmitter<any> = new EventEmitter();
  @Output() checkAll: EventEmitter<boolean> = new EventEmitter();
  @Output() hostChange: EventEmitter<number> = new EventEmitter();
  @Output() imageChange: EventEmitter<string> = new EventEmitter();

  buttonText;
  imageError;

  constructor(
    private cpI18n: CPI18nService,
    private eventService: EventsService,
    private fileUploadService: FileUploadService
  ) {}

  onFileUpload(file) {
    this.imageError = null;
    const validate = this.fileUploadService.validImage(file);

    if (!validate.valid) {
      this.imageError = validate.errors[0];

      return;
    }

    const url = this.eventService.getUploadImageUrl();
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    const headers = new HttpHeaders({
      Authorization: auth
    });

    this.fileUploadService.uploadFile(file, url, headers).subscribe(
      (res: any) => this.imageChange.emit(res.image_url),
      (err) => {
        throw new Error(err);
      }
    );
  }

  ngOnInit() {
    this.buttonText = this.cpI18n.translate('t_events_import_upload_picture');
  }
}
