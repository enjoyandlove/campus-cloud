import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LayoutWidth } from '@app/layouts/interfaces';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { CPSession } from '@app/session';
import { BannerService } from '../banner.service';
import * as school from '@app/session/school.interface';
import { baseActions, ISnackbar } from '@app/store/base';
import { amplitudeEvents } from '@shared/constants/analytics';
import {
  CPI18nService,
  SchoolService,
  ZendeskService,
  CPCroppieService,
  CPTrackingService,
  FileUploadService
} from '@shared/services';

@Component({
  selector: 'cp-banner-list',
  templateUrl: './banner-list.component.html',
  styleUrls: ['./banner-list.component.scss']
})
export class BannerListComponent implements OnInit {
  isEdit;
  tooltipContent;
  form: FormGroup;
  textLogo: string;
  imageSizeToolTip;
  uploading = false;
  canvas: CPCroppieService;
  state: school.ISchoolBranding;
  layoutWidth = LayoutWidth.third;

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private service: BannerService,
    private store: Store<ISnackbar>,
    private schoolService: SchoolService,
    private cpTracking: CPTrackingService,
    private fileUploadService: FileUploadService
  ) {}

  onUploadLogo(file) {
    if (!file) {
      return;
    }

    const validate = this.fileUploadService.validImage(file);
    if (!validate.valid) {
      this.onError(this.cpI18n.translate('customization_image_upload_error'));
      return;
    }

    const validFormat = this.fileUploadService.validateImage(file, ['image/png']);
    if (!validFormat) {
      this.onError(this.cpI18n.translate('t_studio_branding_image_req'));
      return;
    }

    this.fileUploadService.uploadImage(file).subscribe((res: any) => {
      this.form.controls[school.SCHOOL_LOGO_URL].setValue(res.image_url);
      this.form.controls[school.SCHOOL_LOGO_URL].markAsDirty();
    });
  }

  onRemoveLogo() {
    this.form.controls[school.SCHOOL_LOGO_URL].setValue('');
    this.form.controls[school.SCHOOL_LOGO_URL].markAsDirty();
  }

  onChangeColor(color) {
    this.form.controls[school.BRANDING_COLOR].setValue(color);
    this.form.controls[school.BRANDING_COLOR].markAsDirty();
  }

  onReset() {
    this.isEdit = false;
  }

  onCancel() {
    this.form.reset(this.state);
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

  onError(message = this.cpI18n.translate('something_went_wrong')) {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        autoClose: true,
        class: 'danger',
        body: message
      }
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

  onCrop() {
    this.imageToBase64().then((base64ImageData) => {
      this.form.controls[school.LOGO_URL].setValue(base64ImageData);
      this.form.controls[school.LOGO_URL].markAsDirty();
      this.onReset();
    });
  }

  saveSchoolBranding() {
    const schoolBranding: school.ISchoolBranding = this.form.value;
    return this.schoolService
      .updateSchoolBranding(this.session.school.id, schoolBranding)
      .toPromise();
  }

  onSave() {
    let saveSchoolBrandingPromise = this.saveSchoolBranding();

    const logoControl = this.form.controls[school.LOGO_URL];
    if (logoControl.dirty) {
      this.uploading = true;
      saveSchoolBrandingPromise = this.uploadBase64Image(logoControl.value).then(
        (savedBase64Image: any) => {
          this.uploading = false;
          logoControl.setValue(savedBase64Image.image_url);
          return this.saveSchoolBranding();
        }
      );
    }

    saveSchoolBrandingPromise
      .then((branding: school.ISchoolBranding) => {
        this.state = {
          ...branding
        };
        this.form.reset(this.state);
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

    this.imageSizeToolTip = {
      html: true,
      trigger: 'click'
    };

    this.tooltipContent = `<a
    class='cpbtn cpbtn--link'
    href='${zendesk}/articles/360001101794-What-size-images-should-I-use-in-Campus-Cloud'>
    ${this.cpI18n.translate('learn_more')}
    </a>`;

    this.textLogo = this.session.school.short_name;
    this.state = {
      logo_url: this.session.school.logo_url,
      branding_color: this.session.school.branding_color,
      school_name_logo_url: this.session.school.school_name_logo_url
    };
    this.form = this.fb.group({
      [school.LOGO_URL]: [this.state.logo_url],
      [school.SCHOOL_LOGO_URL]: [this.state.school_name_logo_url],
      [school.BRANDING_COLOR]: [
        this.state.branding_color,
        [Validators.required, Validators.pattern(/^[0-9A-F]{6}$/i)]
      ]
    });
  }
}
