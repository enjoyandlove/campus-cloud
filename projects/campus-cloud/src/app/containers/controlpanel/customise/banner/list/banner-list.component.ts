import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LayoutWidth } from '@campus-cloud/layouts/interfaces';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { CPSession } from '@campus-cloud/session';
import { baseActionClass } from '@campus-cloud/store';
import { LogoValidatorService } from './logo.validator.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import * as school from '@campus-cloud/session/school.interface';
import { baseActions, ISnackbar } from '@campus-cloud/store/base';
import {
  ImageService,
  CPI18nService,
  SchoolService,
  ZendeskService,
  CPCroppieService,
  CPTrackingService,
  ImageValidatorService
} from '@campus-cloud/shared/services';

const IMAGE_SIZE_WIDTH = 1440;

@Component({
  selector: 'cp-banner-list',
  templateUrl: './banner-list.component.html',
  styleUrls: ['./banner-list.component.scss'],
  providers: [
    ImageService,
    LogoValidatorService,
    { provide: ImageValidatorService, useExisting: LogoValidatorService }
  ]
})
export class BannerListComponent implements OnInit {
  isEdit;
  form: FormGroup;
  imageRatio = 1.8;
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
    private store: Store<ISnackbar>,
    private imageService: ImageService,
    private schoolService: SchoolService,
    private cpTracking: CPTrackingService
  ) {}

  onUploadLogo(file: File) {
    if (!file) {
      return;
    }

    this.imageService.upload(file).subscribe(
      ({ image_url }: any) => {
        this.form.controls[school.SCHOOL_LOGO_URL].setValue(image_url);
        this.form.controls[school.SCHOOL_LOGO_URL].markAsDirty();
      },
      (err: Error) => this.onError(err.message)
    );
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
      viewport: { width: 400, height: 400 / this.imageRatio },
      boundary: IMAGE_SIZE_WIDTH / this.imageRatio,
      url: `${image}?disableCache=true`
    };

    this.canvas = new CPCroppieService(hostEl, canvasOptions);
  }

  imageToBase64(): Promise<any> {
    return this.canvas.result({
      type: 'base64',
      size: { width: IMAGE_SIZE_WIDTH, height: IMAGE_SIZE_WIDTH / this.imageRatio },
      format: 'jpeg'
    });
  }

  uploadBase64Image(base64ImageData: string) {
    this.uploading = true;
    return this.imageService.uploadBase64(base64ImageData).toPromise();
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
          if (savedBase64Image.image_url.length > 128) {
            throw Error('Image too big');
          }
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
      .catch(() => {
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
