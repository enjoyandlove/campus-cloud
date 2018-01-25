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
import { CPI18nService } from '../../../../../shared/services/index';

@Component({
  selector: 'cp-customization-list',
  templateUrl: './customization-list.component.html',
  styleUrls: ['./customization-list.component.scss'],
})
export class CustomizationListComponent extends BaseComponent
  implements OnInit {
  image;
  canvas;
  isEdit;
  loading;

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
    this.image = image;

    this.canvas.bind({ url: image });
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
      setTimeout(
        () => {
          this.canvasInit(res.data.cover_photo_url);
        },

        5,
      );
    });
  }

  canvasInit(image) {
    // https://foliotek.github.io/Croppie/
    const Croppie = require('croppie');
    const hostEl = document.getElementById('canvas_wrapper');

    this.canvas = new Croppie(hostEl, {
      enableZoom: false,
      enforceBoundary: true,
      enableOrientation: false,
      viewport: { width: 665, height: 270 },
      boundary: { height: 270 },
      url: image,
    });
  }

  imageToBase64(): Promise<any> {
    return this.canvas.result({
      type: 'base64',
      size: 'viewport',
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
    this.imageToBase64()
      .then((base64ImageData) => this.uploadBase64Image(base64ImageData))
      .then((savedBase64Image) => {
        const search = new URLSearchParams();
        search.append('school_id', this.session.g.get('school').id);

        return this.service
          .updateSchoolImage(savedBase64Image.image_url, search)
          .toPromise();
      })
      .then(() => {
        this.onReset();
        this.onSuccess();
      })
      .catch((_) => {
        this.onError();
      });
  }

  ngOnInit() {
    this.loadImage();
  }
}
