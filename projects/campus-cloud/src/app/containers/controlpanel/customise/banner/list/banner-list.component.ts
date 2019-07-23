import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LayoutWidth } from '@campus-cloud/layouts/interfaces';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { CPSession } from '@campus-cloud/session';
import { baseActionClass } from '@campus-cloud/store';
import { BannerService } from '../banner.service';
import * as school from '@campus-cloud/session/school.interface';
import { baseActions, ISnackbar } from '@campus-cloud/store/base';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import {
  CPI18nService,
  SchoolService,
  ZendeskService,
  CPCroppieService,
  CPTrackingService,
  FileUploadService
} from '@campus-cloud/shared/services';

const IMAGE_RATIO = 1.8;
const IMAGE_SIZE_WIDTH = 664;

@Component({
  selector: 'cp-banner-list',
  templateUrl: './banner-list.component.html',
  styleUrls: ['./banner-list.component.scss']
})
export class BannerListComponent implements OnInit {
  isEdit;
  form: FormGroup;
  textLogo: string;
  uploading = false;
  bannerPkdbLink: string;
  canvas: CPCroppieService;
  brandingPkdbLink: string;
  state: school.ISchoolBranding;
  layoutWidth = LayoutWidth.third;

  eventProperties = {
    logo: null,
    banner: amplitudeEvents.NO_CHANGES,
    branding_color: amplitudeEvents.NO_CHANGES
  };

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
      this.onError(
        validate.errors.length
          ? validate.errors[0]
          : this.cpI18n.translate('t_studio_branding_image_req')
      );
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

    this.eventProperties = {
      ...this.eventProperties,
      branding_color: amplitudeEvents.CHANGED
    };
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
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: message
      })
    );
  }

  onError(message = this.cpI18n.translate('something_went_wrong')) {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: message
      })
    );
  }

  canvasInit(image) {
    const hostEl = document.getElementById('canvas_wrapper');
    const canvasOptions = {
      showZoomer: false,
      enableResize: false,
      enableOrientation: true,
      viewport: { width: 400, height: 400 / IMAGE_RATIO },
      boundary: IMAGE_SIZE_WIDTH / IMAGE_RATIO,
      url: `${image}?disableCache=true`
    };

    this.canvas = new CPCroppieService(hostEl, canvasOptions);
  }

  imageToBase64(): Promise<any> {
    return this.canvas.result({
      type: 'base64',
      size: { width: IMAGE_SIZE_WIDTH, height: IMAGE_SIZE_WIDTH / IMAGE_RATIO },
      format: 'jpeg'
    });
  }

  uploadBase64Image(base64ImageData: string) {
    this.uploading = true;
    const body = {
      base64_image: base64ImageData
    };

    return this.service.uploadBase64Image(body).toPromise();
  }

  onCrop() {
    this.imageToBase64()
      .then((base64ImageData) => {
        this.form.controls[school.LOGO_URL].setValue(base64ImageData);
        this.form.controls[school.LOGO_URL].markAsDirty();
        this.onReset();

        this.eventProperties = {
          ...this.eventProperties,
          banner: amplitudeEvents.CHANGED
        };
      })
      .catch(() => this.onError());
  }

  saveDisabled() {
    return this.form.invalid || this.form.pristine || this.uploading || this.isEdit;
  }

  saveSchoolBranding() {
    const schoolBranding: school.ISchoolBranding = this.form.value;
    return this.schoolService
      .updateSchoolBranding(this.session.school.id, schoolBranding)
      .toPromise();
  }

  onSave() {
    const logoControl = this.form.controls[school.LOGO_URL];

    const saveSchoolBrandingPromise = logoControl.dirty
      ? this.uploadBase64Image(logoControl.value).then((savedBase64Image: any) => {
          this.uploading = false;
          logoControl.setValue(savedBase64Image.image_url);
          return this.saveSchoolBranding();
        })
      : this.saveSchoolBranding();

    saveSchoolBrandingPromise
      .then((branding: school.ISchoolBranding) => {
        this.state = {
          ...branding
        };

        this.onSuccess();
        this.trackEvent(branding.school_name_logo_url);
        this.form.reset(this.state);
        this.onReset();
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

  trackEvent(logUrl: string) {
    const logo = logUrl ? amplitudeEvents.SCHOOL_LOGO : amplitudeEvents.SCHOOL_NAME;

    this.eventProperties = {
      ...this.eventProperties,
      logo
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.CUSTOMIZE_CHANGED_BRANDING,
      this.eventProperties
    );

    this.resetEventProperties();
  }

  resetEventProperties() {
    this.eventProperties = {
      logo: null,
      banner: amplitudeEvents.NO_CHANGES,
      branding_color: amplitudeEvents.NO_CHANGES
    };
  }

  ngOnInit() {
    this.updateHeader();

    const zendesk = ZendeskService.zdRoot();

    this.brandingPkdbLink = `${zendesk}/articles/360022846813`;
    this.bannerPkdbLink = `${zendesk}//articles/360001101794-What-size-images-should-I-use-in-Campus-Cloud`;

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
