import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { API } from '../../../../../config/api';
import { CPSession } from '../../../../../session';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { appStorage } from '../../../../../shared/utils';
import { ILink } from '../link.interface';
import { LinksService } from '../links.service';
import {
  CPTrackingService,
  FileUploadService,
  ZendeskService
} from '../../../../../shared/services';

declare var $: any;

@Component({
  selector: 'cp-links-create',
  templateUrl: './links-create.component.html',
  styleUrls: ['./links-create.component.scss']
})
export class LinksCreateComponent implements OnInit {
  @Output() createLink: EventEmitter<ILink> = new EventEmitter();
  @Output() resetCreateModal: EventEmitter<null> = new EventEmitter();

  storeId;
  imageError;
  tooltipContent;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    public cpI18n: CPI18nService,
    private service: LinksService,
    private cpTracking: CPTrackingService,
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
    this.service.createLink(this.form.value).subscribe((res: any) => {
      $('#linksCreate').modal('hide');
      this.createLink.emit(res);
      this.resetModal();
    });
  }

  resetModal() {
    this.resetCreateModal.emit();
  }

  handleDeleteImage() {
    this.form.controls['img_url'].setValue(null);
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
  }
}
