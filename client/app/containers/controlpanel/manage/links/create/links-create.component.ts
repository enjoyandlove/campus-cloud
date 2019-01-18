import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { API } from '@app/config/api';
import { CPSession } from '@app/session';
import { appStorage } from '@shared/utils';
import { LinksService } from '../links.service';
import * as fromLinks from '@app/store/manage/links';
import { amplitudeEvents } from '@shared/constants/analytics';
import { CPI18nService } from '@shared/services/i18n.service';
import { Destroyable, Mixin } from '@client/app/shared/mixins';
import { CPTrackingService, FileUploadService, ZendeskService } from '@shared/services';

declare var $: any;

@Component({
  selector: 'cp-links-create',
  templateUrl: './links-create.component.html',
  styleUrls: ['./links-create.component.scss']
})
@Mixin([Destroyable])
export class LinksCreateComponent implements OnInit, OnDestroy, Destroyable {
  @Output() createLink: EventEmitter<null> = new EventEmitter();
  @Output() resetCreateModal: EventEmitter<null> = new EventEmitter();

  storeId;
  imageError;
  tooltipContent;
  form: FormGroup;

  eventProperties = {
    link_id: null
  };

  // Destroyable
  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
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
  }

  resetModal() {
    this.resetCreateModal.emit();
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
    this.tooltipContent = {
      content: '',
      link: {
        url: `${zendesk}/articles/360001101794-What-size-images-should-I-use-in-Campus-Cloud`,
        text: this.cpI18n.translate('learn_more')
      }
    };

    this.updates$
      .pipe(ofType(fromLinks.LinksActionTypes.CREATE_LINK_SUCCESS), takeUntil(this.destroy$))
      .subscribe((action: fromLinks.CreateLinkSuccess) => {
        const res = action.payload;

        this.trackEvent(res);
        $('#linksCreate').modal('hide');
        this.createLink.emit();
        this.resetModal();
      });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
