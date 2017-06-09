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
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Headers, URLSearchParams } from '@angular/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { API } from '../../../../../../../config/api';
import { FeedsService } from '../../../feeds.service';
import { STATUS } from '../../../../../../../shared/constants';
import { CPSession, ISchool } from '../../../../../../../session';
import { CPArray, CPImage, appStorage } from '../../../../../../../shared/utils';
import { FileUploadService, StoreService } from '../../../../../../../shared/services';

@Component({
  selector: 'cp-feed-input-box',
  templateUrl: './feed-input-box.component.html',
  styleUrls: ['./feed-input-box.component.scss']
})
export class FeedInputBoxComponent implements AfterViewInit, OnInit {
  @Input() clubId: number;
  @ViewChild('textarea') textarea: ElementRef;
  @Input() isCampusWallView: Observable<any>;
  @Output() created: EventEmitter<null> = new EventEmitter();

  groupId;
  stores$;
  channels$;
  imageError;
  form: FormGroup;
  school: ISchool;
  _isCampusWallView;
  placeHolder = 'Add some text to this post...';
  reset$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private feedsService: FeedsService,
    private storeService: StoreService,
    private fileUploadService: FileUploadService
  ) {
    let search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    this.stores$ = this.storeService.getStores(search);

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
    let _data = this.parseData(data);
    let groupWall$ = this.feedsService.postToGroupWall(_data);
    let campusWall$ = this.feedsService.postToCampusWall(_data);
    let stream$ = this._isCampusWallView ? groupWall$ : campusWall$;

    stream$
      .subscribe(
      res => {
        if (!this.clubId) {
          this.form.reset();
        }
        this.form.controls['message'].setValue(null);
        this.reset$.next(true);
        this.created.emit(res);
        this.textarea.nativeElement.innerHTML = this.placeHolder;
      }
      );
  }

  parseData(data) {
    let _data = {
      'post_type': data.post_type || null,
      'store_id': data.store_id,
      'school_id': this.session.school.id,
      'message': data.message,
      'message_image_url': data.message_image_url
    };

    if (this._isCampusWallView) {
      _data['group_id'] = this.groupId;
    }

    return _data;
  }

  ngAfterViewInit() {
    let el = this.textarea.nativeElement;

    Observable
      .fromEvent(el, 'click')
      .subscribe((res: any) => {
        if (res.target.textContent === this.placeHolder) {
          res.target.textContent = null;
          this.form.controls['message'].setValue(null);
        }
      });

    Observable
      .fromEvent(el, 'blur')
      .subscribe((res: any) => {
        if (!res.target.textContent) {
          res.target.textContent = this.placeHolder;
          this.form.controls['message'].setValue(null);
        }
      });

    Observable
      .fromEvent(el, 'keyup')
      .subscribe((res: any) => {
        if (!res.target.textContent) {
          res.target.textContent = this.placeHolder;
          this.form.controls['message'].setValue(null);
          return;
        }
        this.form.controls['message'].setValue(res.target.textContent);
      });
  }

  onDeleteImage() {
    this.form.controls['message_image_url'].setValue(null);
  }

  onSelectedHost(host): void {
    this.form.controls['store_id'].setValue(host.value);
  }

  onSelectedChannel(channel): void {
    this.form.controls['post_type'].setValue(channel.action);
  }

  onFileUpload(file) {
    this.imageError = null;
    const fileExtension = CPArray.last(file.name.split('.'));

    if (!CPImage.isSizeOk(file.size, CPImage.MAX_IMAGE_SIZE)) {
      this.imageError = STATUS.FILE_IS_TOO_BIG;
      return;
    }

    if (!CPImage.isValidExtension(fileExtension, CPImage.VALID_EXTENSIONS)) {
      this.imageError = STATUS.WRONG_EXTENSION_IMAGE;
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
    this.school = this.session.school;
    this.isCampusWallView.subscribe(res => {
      // Not Campus Wall
      if (res.type !== 1) {
        this.groupId = res.type;
        this.form.controls['store_id'].setValue(res.group_id);
        this.form.removeControl('post_type');
        this._isCampusWallView = true;
        return;
      }

      if (this.form) {
        this.form.registerControl('post_type', new FormControl(null, Validators.required));
        this.form.controls['store_id'].setValue(null);
      }

      this._isCampusWallView = false;
    });

    this.form = this.fb.group({
      'group_id': [null],
      'school_id': [this.session.school.id],
      'store_id': [null, Validators.required],
      'post_type': [null, Validators.required],
      'message': [null, [Validators.required, Validators.maxLength(500)]],
      'message_image_url': [null]
    });
  }
}
