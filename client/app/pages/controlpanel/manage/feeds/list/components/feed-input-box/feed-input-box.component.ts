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
  textareaHeight = '61px';

  constructor(
    private fb: FormBuilder,
    private feedsService: FeedsService,
    private fileUploadService: FileUploadService
  ) { }

  onSubmit(data) {
    console.log(data);
  }

  ngAfterViewInit() {
    let el = this.textarea.nativeElement;
    // http://stackoverflow.com/questions/995168/textarea-to-resize-based-on-content-length
    Observable.fromEvent(el, 'keyup').subscribe((res: any) => {
      this.textareaHeight = res.target.scrollHeight + 'px';
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

    setTimeout(() => {
      this
      .form
      .controls['message_image_url']
      .setValue('https://source.unsplash.com/random/300x300')
    }, 2000);
  }
}
