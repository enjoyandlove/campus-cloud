import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { CustomizationService } from './../customization.service';
import {
  ISnackbar,
  SNACKBAR_SHOW,
} from '../../../../../reducers/snackbar.reducer';
import {
  CPI18nService,
  CPCroppieService,
} from '../../../../../shared/services/index';

@Component({
  selector: 'cp-customization-list',
  templateUrl: './customization-list.component.html',
  styleUrls: ['./customization-list.component.scss'],
})
export class CustomizationListComponent extends BaseComponent
  implements OnInit {
  isEdit;
  loading;
  originalImage;
  uploading = false;
  canvas: CPCroppieService;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    public service: CustomizationService,
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  onReset() {
    this.isEdit = false;
  }

  onCancel() {
    this.onReset();
  }

  onUpload(image) {
    this.isEdit = true;

    setTimeout(
      () => {
        this.canvasInit(image);
      },

      5,
    );
  }

  onSuccess(
    message = this.cpI18n.translate('customization_image_upload_success'),
  ) {
    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        body: message,
        autoClose: true,
      },
    });
  }

  onError(message = this.cpI18n.translate('customization_image_upload_error')) {
    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        autoClose: true,
        class: 'danger',
        body: message,
      },
    });
  }

  loadImage() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    const stream$ = this.service.getCoverImage(search);
    super.fetchData(stream$).then((res) => {
      this.originalImage = res.data.cover_photo_url;
    });
  }

  canvasInit(image) {
    const hostEl = document.getElementById('canvas_wrapper');
    const canvasOptions = {
      showZoomer: false,
      enableResize: false,
      enableOrientation: true,
      viewport: { width: 320, height: 180 },
      boundary: { width: 665, height: 270 },
      url: `${image}?disableCache=true`,
    };

    this.canvas = new CPCroppieService(hostEl, canvasOptions);
  }

  imageToBase64(): Promise<any> {
    return this.canvas.result({
      type: 'base64',
      size: 'original',
      format: 'jpeg',
    });
  }

  uploadBase64Image(base64ImageData: string) {
    const body = {
      base64_image: base64ImageData,
    };

    return this.service.uploadBase64Image(body).toPromise();
  }

  onSave() {
    this.uploading = true;
    this.imageToBase64()
      .then((base64ImageData) => this.uploadBase64Image(base64ImageData))
      .then((savedBase64Image) => {
        this.uploading = false;
        const search = new URLSearchParams();
        search.append('school_id', this.session.g.get('school').id);

        return this.service
          .updateSchoolImage(savedBase64Image.image_url, search)
          .toPromise();
      })
      .then((res) => {
        this.originalImage = res.cover_photo_url;
        this.onReset();
        this.onSuccess();
      })
      .catch((_) => {
        this.onError();
        this.uploading = false;
      });
  }

  ngOnInit() {
    this.loadImage();
  }
}
