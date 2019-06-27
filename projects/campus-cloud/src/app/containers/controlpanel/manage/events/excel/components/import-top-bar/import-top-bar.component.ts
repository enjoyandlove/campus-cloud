/*tslint:disable:max-line-length*/
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { ISnackbar, baseActions } from '../../../../../../../store/base';
import { FileUploadService, CPI18nService } from '../../../../../../../shared/services';
import { CPImageUploadComponent } from './../../../../../../../shared/components/cp-image-upload/cp-image-upload.component';

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
    public store: Store<ISnackbar>,
    private fileUploadService: FileUploadService,
    public cpI18n: CPI18nService
  ) {}

  onFileUpload(file) {
    const imageUpload = new CPImageUploadComponent(this.cpI18n, this.fileUploadService);
    const promise = imageUpload.onFileUpload(file, true);

    promise
      .then((res: any) => this.imageChange.emit(res.image_url))
      .catch((err) =>
        this.store.dispatch({
          type: baseActions.SNACKBAR_SHOW,
          payload: {
            class: 'danger',
            autoClose: true,
            sticky: true,
            body: err ? err : this.cpI18n.translate('something_went_wrong')
          }
        })
      );
  }

  ngOnInit() {
    this.buttonText = this.cpI18n.translate('t_events_import_upload_picture');
  }
}
