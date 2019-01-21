import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  OnDestroy
} from '@angular/core';

import { API } from '@app/config/api';
import { appStorage } from '@shared/utils';
import { Destroyable, Mixin } from '@shared/mixins';
import * as fromLinks from '@app/store/manage/links';
import { CPI18nService } from '@shared/services/i18n.service';
import { amplitudeEvents } from '@shared/constants/analytics';
import { didUrlChange, LinksService } from '../links.service';
import { CPTrackingService, FileUploadService, ZendeskService } from '@shared/services';

declare var $: any;

@Component({
  selector: 'cp-links-edit',
  templateUrl: './links-edit.component.html',
  styleUrls: ['./links-edit.component.scss']
})
@Mixin([Destroyable])
export class LinksEditComponent implements OnInit, OnChanges, OnDestroy, Destroyable {
  @Input() link: any;
  @Output() editLink: EventEmitter<null> = new EventEmitter();
  @Output() resetEditModal: EventEmitter<null> = new EventEmitter();

  imageError;
  tooltipContent;
  form: FormGroup;

  eventProperties = {
    link_id: null,
    changed_url: null
  };

  // Destroyable
  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    private fb: FormBuilder,
    private updates$: Actions,
    public cpI18n: CPI18nService,
    private service: LinksService,
    private cpTracking: CPTrackingService,
    private store: Store<fromLinks.ILinksState>,
    private fileUploadService: FileUploadService
  ) {}

  buildForm() {
    this.form = this.fb.group({
      link_url: [this.link.link_url, Validators.required],
      name: [this.link.name, Validators.required],
      school_id: [this.link.school_id, Validators.required],
      description: [this.link.description, Validators.maxLength(512)],
      img_url: [this.link.img_url]
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

  handleDeleteImage() {
    // empty string otherwise the BE wont know we want to delete it
    this.form.controls['img_url'].setValue('');
  }

  doSubmit() {
    this.store.dispatch(new fromLinks.UpdateLink({ link: this.form.value, id: this.link.id }));
  }

  trackEvent(res) {
    this.eventProperties = {
      ...this.eventProperties,
      link_id: res.id,
      changed_url: didUrlChange(this.link.link_url, res.link_url)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_UPDATED_LINK, this.eventProperties);
  }

  ngOnChanges() {
    if (this.link) {
      this.buildForm();
    }
  }

  resetModal() {
    this.resetEditModal.emit();
  }

  ngOnInit() {
    const zendesk = ZendeskService.zdRoot();
    this.tooltipContent = {
      content: '',
      link: {
        url: `${zendesk}/articles/360001101794-What-size-images-should-I-use-in-Campus-Cloud`,
        text: this.cpI18n.translate('learn_more')
      }
    };

    this.updates$
      .pipe(ofType(fromLinks.LinksActionTypes.UPDATE_LINK_SUCCESS), takeUntil(this.destroy$))
      .subscribe((action: fromLinks.UpdateLinkSuccess) => {
        const res = action.payload;

        this.trackEvent(res);
        this.editLink.emit();
        $('#linksEdit').modal('hide');
        this.resetModal();
      });
    this.updates$
      .pipe(ofType(fromLinks.LinksActionTypes.UPDATE_LINK_FAILURE), takeUntil(this.destroy$))
      .subscribe((action: fromLinks.UpdateLinkFailure) => {
        throw new Error(action.payload);
      });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
