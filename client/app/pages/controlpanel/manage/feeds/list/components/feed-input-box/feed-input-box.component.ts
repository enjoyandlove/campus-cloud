import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { API } from '../../../../../../../config/api';
import { FeedsService } from '../../../feeds.service';
import { FileUploadService } from '../../../../../../../shared/services';
import { CPArray, CPImage, appStorage } from '../../../../../../../shared/utils';

@Component({
  selector: 'cp-feed-input-box',
  templateUrl: './feed-input-box.component.html',
  styleUrls: ['./feed-input-box.component.scss']
})
export class FeedInputBoxComponent implements AfterViewInit, OnInit {
  @ViewChild('textarea') textarea: ElementRef;
  form: FormGroup;
  channels;
  imageError;
  defaultText = 'What\'s on your mind?';

  constructor(
    private fb: FormBuilder,
    private feedsService: FeedsService,
    private fileUploadService: FileUploadService
  ) { }

  onSubmit(data) {
    console.log(data);
    this.form.reset();
  }

  ngAfterViewInit() {
    let el = this.textarea.nativeElement;
    // http://stackoverflow.com/questions/995168/textarea-to-resize-based-on-content-length
    Observable
      .fromEvent(el, 'click')
      .subscribe((res: any) => {
        if (res.target.textContent === this.defaultText) {
          res.target.textContent = '';
        }
        return;
      });

    Observable
      .fromEvent(el, 'blur')
      .subscribe((res: any) => {
        if (res.target.textContent === '') {
          res.target.textContent = this.defaultText;
        }
        return;
      });

    Observable
      .fromEvent(el, 'keyup')
      .debounceTime(100)
      .distinctUntilChanged()
      .subscribe((res: any) => {
      if (!res.target.textContent) {
        el.innerHTML = this.defaultText;
      }
      this.form.controls['message'].setValue(res.target.textContent);
    });
  }

  onSelectedChannel(channel) {
    this.form.controls['post_type'].setValue(channel.action);
  }

  onFileUpload(file) {
    this.imageError = null;
    const fileExtension = CPArray.last(file.name.split('.'));

    if (!CPImage.isSizeOk(file.size, CPImage.MAX_IMAGE_SIZE)) {
      this.imageError = 'File too Big';
      return;
    }

    if (!CPImage.isValidExtension(fileExtension, CPImage.VALID_EXTENSIONS)) {
      this.imageError = 'Invalid Extension';
      return;
    }

    const headers = new Headers();
    const url = this.feedsService.getUploadImageUrl();
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    headers.append('Authorization', auth);

    this
      .fileUploadService
      .uploadFile(file, url, headers)
      .subscribe(
      res => {
        this.form.controls['message_image_url'].setValue(res.image_url);
      },
      err => console.error(err)
      );
  }

  removePhoto(): void {
    this.form.controls['message_image_url'].setValue(null);
  }

  ngOnInit() {
    this.channels = [
      {
        action: 1,
        label: 'Dummy Channel'
      },
      {
        action: 2,
        label: 'Dummy Channel 2'
      },
      {
        action: 3,
        label: 'Dummy Channel 3'
      }
    ];

    this.form = this.fb.group({
      'message': [null, Validators.required],
      'message_image_url': [null],
      'post_type': [this.channels[0], Validators.required]
    });
  }
}
