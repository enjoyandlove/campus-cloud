import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ISnackbar, baseActions } from '@campus-cloud/store/base';
import { ImageService, CPI18nService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-services-import-top-bar',
  templateUrl: './import-top-bar.component.html',
  styleUrls: ['./import-top-bar.component.scss']
})
export class ServicesImportTopBarComponent implements OnInit {
  @Input() isChecked: boolean;
  @Input() categories: Observable<any>;
  @Input() uploadImageButtonClass: string;
  @Input() categoryDropDownStatus: boolean;

  @Output() checkAll: EventEmitter<boolean> = new EventEmitter();
  @Output() imageChange: EventEmitter<string> = new EventEmitter();
  @Output() deleteServices: EventEmitter<any> = new EventEmitter();
  @Output() categoryChange: EventEmitter<number> = new EventEmitter();

  stores;
  imageError;
  loading = true;

  constructor(
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    private imageService: ImageService
  ) {}

  errorHandler(body = this.cpI18n.translate('something_went_wrong')) {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        body,
        sticky: true,
        class: 'danger'
      }
    });
  }

  onFileUpload(file) {
    this.imageError = null;
    this.imageService
      .upload(file)
      .subscribe(
        ({ image_url }: any) => this.imageChange.emit(image_url),
        () => this.errorHandler()
      );
  }

  ngOnInit() {}
}
