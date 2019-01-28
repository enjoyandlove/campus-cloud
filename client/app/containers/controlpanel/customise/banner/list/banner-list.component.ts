import { LayoutWidth } from '@app/layouts/interfaces';
import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { CPSession } from '@app/session';
import { BaseComponent } from '@app/base';
import { BannerService } from '../banner.service';
import { baseActions, ISnackbar } from '@app/store/base';
import { amplitudeEvents } from '@shared/constants/analytics';
import {
  CPI18nService,
  CPCroppieService,
  CPTrackingService,
  ZendeskService
} from '@shared/services';

@Component({
  selector: 'cp-banner-list',
  templateUrl: './banner-list.component.html',
  styleUrls: ['./banner-list.component.scss']
})
export class BannerListComponent extends BaseComponent implements OnInit {
  isEdit;
  loading;
  originalImage;
  tooltipContent;
  imageSizeToolTip;
  uploading = false;
  canvas: CPCroppieService;
  layoutWidth = LayoutWidth.third;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    public service: BannerService,
    public cpTracking: CPTrackingService
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

      5
    );
  }

  onSuccess(message = this.cpI18n.translate('customization_image_upload_success')) {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        body: message,
        autoClose: true
      }
    });
  }

  onError(message = this.cpI18n.translate('customization_image_upload_error')) {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        autoClose: true,
        class: 'danger',
        body: message
      }
    });
  }

  loadImage() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

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
      url: `${image}?disableCache=true`
    };

    this.canvas = new CPCroppieService(hostEl, canvasOptions);
  }

  imageToBase64(): Promise<any> {
    return this.canvas.result({
      type: 'base64',
      size: 'original',
      format: 'jpeg'
    });
  }

  uploadBase64Image(base64ImageData: string) {
    const body = {
      base64_image: base64ImageData
    };

    return this.service.uploadBase64Image(body).toPromise();
  }

  onSave() {
    this.uploading = true;
    this.imageToBase64()
      .then((base64ImageData) => this.uploadBase64Image(base64ImageData))
      .then((savedBase64Image: any) => {
        this.uploading = false;
        const search = new HttpParams().append('school_id', this.session.g.get('school').id);

        return this.service.updateSchoolImage(savedBase64Image.image_url, search).toPromise();
      })
      .then((res: any) => {
        this.originalImage = res.cover_photo_url;
        this.onReset();
        this.onSuccess();
        this.trackUploadImageEvent();
      })
      .catch((_) => {
        this.onError();
        this.uploading = false;
      });
  }

  updateHeader() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: require('../../customise.header.json')
    });
  }

  trackUploadImageEvent() {
    const properties = this.cpTracking.getEventProperties();

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.UPLOADED_PHOTO, properties);
  }

  ngOnInit() {
    this.updateHeader();

    const zendesk = ZendeskService.zdRoot();
    this.loadImage();

    this.imageSizeToolTip = {
      html: true,
      trigger: 'click'
    };

    this.tooltipContent = `<a
      class='cpbtn cpbtn--link'
      href='${zendesk}/articles/360001101794-What-size-images-should-I-use-in-Campus-Cloud'>
      ${this.cpI18n.translate('learn_more')}
    </a>`;
  }
}
