import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ApiService } from '@campus-cloud/base';
import { appStorage } from '@campus-cloud/shared/utils';
import { ISnackbar, baseActions } from '@campus-cloud/store/base';
import { FileUploadService, CPI18nService } from '@campus-cloud/shared/services';

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
    private api: ApiService,
    private fileUploadService: FileUploadService,
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>
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
    const validate = this.fileUploadService.validImage(file);

    if (!validate.valid) {
      this.imageError = validate.errors[0];

      this.errorHandler(validate.errors[0]);

      return;
    }

    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.IMAGE}/`;
    const auth = `${this.api.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    const headers = new HttpHeaders({
      Authorization: auth
    });

    this.fileUploadService
      .uploadFile(file, url, headers)
      .subscribe((res: any) => this.imageChange.emit(res.image_url), (_) => this.errorHandler());
  }

  ngOnInit() {}
}
