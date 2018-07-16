import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { API } from '../../../../../config/api';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { appStorage } from '../../../../../shared/utils';
import { ILink } from '../link.interface';
import { didUrlChange, LinksService } from '../links.service';
import {
  CPTrackingService,
  FileUploadService,
  ZendeskService
} from '../../../../../shared/services';

declare var $: any;

@Component({
  selector: 'cp-links-edit',
  templateUrl: './links-edit.component.html',
  styleUrls: ['./links-edit.component.scss']
})
export class LinksEditComponent implements OnInit, OnChanges {
  @Input() link: any;
  @Output() editLink: EventEmitter<ILink> = new EventEmitter();
  @Output() resetEditModal: EventEmitter<null> = new EventEmitter();

  imageError;
  tooltipContent;
  form: FormGroup;

  eventProperties = {
    link_id: null,
    changed_url: null
  };

  constructor(
    private fb: FormBuilder,
    public cpI18n: CPI18nService,
    private service: LinksService,
    private cpTracking: CPTrackingService,
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
    this.service.updateLink(this.form.value, this.link.id).subscribe(
      (res: any) => {
        this.trackEvent(res);
        this.editLink.emit(res);
        $('#linksEdit').modal('hide');
        this.resetModal();
      },
      (err) => {
        throw new Error(err);
      }
    );
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
  }
}
