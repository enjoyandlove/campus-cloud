import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil } from 'rxjs/operators';
import { TooltipOption } from 'bootstrap';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { API } from '@app/config/api';
import { CPSession } from '@app/session';
import { appStorage } from '@shared/utils';
import { LinksService } from '../links.service';
import * as fromLinks from '@app/store/manage/links';
import { amplitudeEvents } from '@shared/constants/analytics';
import { Destroyable, Mixin } from '@client/app/shared/mixins';
import {
  IModal,
  MODAL_DATA,
  CPI18nService,
  ZendeskService,
  CPTrackingService,
  FileUploadService
} from '@shared/services';

@Component({
  selector: 'cp-links-create',
  templateUrl: './links-create.component.html',
  styleUrls: ['./links-create.component.scss']
})
@Mixin([Destroyable])
export class LinksCreateComponent implements OnInit, OnDestroy, Destroyable {
  storeId;
  imageError;
  form: FormGroup;
  tooltipContent: string;
  imageSizeToolTip: TooltipOption;

  eventProperties = {
    link_id: null
  };

  // Destroyable
  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    @Inject(MODAL_DATA) private modal: IModal,
    private fb: FormBuilder,
    private updates$: Actions,
    private session: CPSession,
    public cpI18n: CPI18nService,
    private service: LinksService,
    private cpTracking: CPTrackingService,
    private store: Store<fromLinks.ILinksState>,
    private fileUploadService: FileUploadService
  ) {}

  buildForm() {
    this.form = this.fb.group({
      name: [null, Validators.required],
      link_url: [null, Validators.required],
      school_id: [this.storeId, Validators.required],
      description: [null, Validators.maxLength(512)],
      img_url: [null]
    });
  }

  onFileUpload(file) {
    this.imageError = null;
    const validate = this.fileUploadService.validImage(file);

    if (!validate.valid) {
      this.imageError = validate.errors[0];

      return;
    }

    const url = this.service.getUploadImageUrl();
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    const headers = new HttpHeaders({
      Authorization: auth
    });

    this.fileUploadService.uploadFile(file, url, headers).subscribe(
      (res: any) => {
        this.form.controls['img_url'].setValue(res.image_url);
        this.trackUploadImageEvent();
      },
      (err) => {
        throw new Error(err);
      }
    );
  }

  trackUploadImageEvent() {
    const properties = this.cpTracking.getEventProperties();

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.UPLOADED_PHOTO, properties);
  }

  doSubmit() {
    this.store.dispatch(new fromLinks.CreateLink(this.form.value));
    this.modal.onClose();
  }

  resetModal() {
    this.modal.onClose();
  }

  handleDeleteImage() {
    this.form.controls['img_url'].setValue(null);
  }

  trackEvent(res) {
    this.eventProperties = {
      ...this.eventProperties,
      link_id: res.id
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_CREATED_LINK, this.eventProperties);
  }

  ngOnInit() {
    const zendesk = ZendeskService.zdRoot();
    this.storeId = this.session.g.get('school').id;
    this.buildForm();

    this.imageSizeToolTip = {
      html: true,
      trigger: 'click'
    };

    this.tooltipContent = `<a
      class='cpbtn cpbtn--link'
      href='${zendesk}/articles/360001101794-What-size-images-should-I-use-in-Campus-Cloud'>
      ${this.cpI18n.translate('learn_more')}
    </a>`;

    this.updates$
      .pipe(ofType(fromLinks.LinksActionTypes.CREATE_LINK_SUCCESS), takeUntil(this.destroy$))
      .subscribe((action: fromLinks.CreateLinkSuccess) => {
        const res = action.payload;

        this.trackEvent(res);
        this.resetModal();
      });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
