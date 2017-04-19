import {
  Input,
  OnInit,
  Output,
  Component,
  ViewChild,
  ElementRef,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Headers, URLSearchParams } from '@angular/http';

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
  @Input() isSimple: boolean;
  @ViewChild('textarea') textarea: ElementRef;
  @Output() created: EventEmitter<null> = new EventEmitter();

  form: FormGroup;
  channels;
  imageError;
  channels$;
  defaultText = 'What\'s on your mind?';

  constructor(
    private fb: FormBuilder,
    private feedsService: FeedsService,
    private fileUploadService: FileUploadService
  ) {
    const schoolId = 157;
    let search = new URLSearchParams();
    search.append('school_id', schoolId.toString());

    this.channels$ = this.feedsService.getChannelsBySchoolId(1, 100, search)
      .startWith([{ label: '---' }])
      .map(channels => {
        let _channels = [
          {
            label: '---',
            action: null
          }
        ];

        channels.forEach(channel => {
          let _channel = {
            label: channel.name,
            action: channel.id
          };

          _channels.push(_channel);
        });

        return _channels;
      });
  }

  onSubmit(data) {
    // console.log(data);
    if (!this.form.valid) { return; }

    this
      .feedsService
      .postToWall(data)
      .subscribe(
        res => {
          this.form.reset();
          this.created.emit(res);
        },
        err => console.log(err)
      );
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
        if (!res.target.textContent) {
          res.target.textContent = this.defaultText;
        }
        return;
      });

    Observable
      .fromEvent(el, 'keyup')
      .debounceTime(100)
      .distinctUntilChanged()
      .subscribe((res: any) => {
        this.form.controls['message'].setValue(res.target.textContent);
      });
  }

  onSelectedChannel() {
    console.log('What do I do??');
    // this.form.controls['post_type'].setValue(channel.action);
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
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
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
    this.form = this.fb.group({
      'school_id': [157],
      'store_id': [2445],
      'message': [null, Validators.required],
      'message_image_url': [null]
    });
  }
}
