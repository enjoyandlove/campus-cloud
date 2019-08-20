import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { ISnackbar, baseActions } from '@campus-cloud/store/base';
import { ImageService, CPI18nService } from '@campus-cloud/shared/services';

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
    private imageService: ImageService,
    public cpI18n: CPI18nService
  ) {}

  onFileUpload(file) {
    const promise = this.imageService.upload(file).toPromise();

    promise
      .then(({ image_url }: any) => this.imageChange.emit(image_url))
      .catch((err) => {
        this.store.dispatch({
          type: baseActions.SNACKBAR_SHOW,
          payload: {
            class: 'danger',
            autoClose: true,
            sticky: true,
            body: err ? err.message : this.cpI18n.translate('something_went_wrong')
          }
        });
      });
  }

  ngOnInit() {
    this.buttonText = this.cpI18n.translate('t_events_import_upload_picture');
  }
}
