import { Input, OnInit, Output, Component, EventEmitter } from '@angular/core';
import { Headers, URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { StoreService, FileUploadService } from '../../../../../../../shared/services';

import { API } from '../../../../../../../config/api';
import { FeedsService } from '../../../feeds.service';
import { appStorage } from '../../../../../../../shared/utils';
import { CPSession, ISchool } from '../../../../../../../session';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';
import { ISnackbar, SNACKBAR_SHOW } from './../../../../../../../reducers/snackbar.reducer';

@Component({
  selector: 'cp-feed-input-box',
  templateUrl: './feed-input-box.component.html',
  styleUrls: ['./feed-input-box.component.scss']
})
export class FeedInputBoxComponent implements OnInit {
  @Input() clubId: number;
  @Input() threadId: number;
  @Input() postType: number;
  @Input() replyView: boolean;
  @Input() orientationId: number;
  @Input() disablePost: boolean; // TODO REMOVE
  @Input() isCampusWallView: Observable<any>;
  @Output() created: EventEmitter<null> = new EventEmitter();

  groupId;
  stores$;
  channels$;
  imageError;
  buttonData;
  form: FormGroup;
  school: ISchool;
  _isCampusWallView;
  DISABLED_MEMBER_TYPE = 100;
  image$: BehaviorSubject<string> = new BehaviorSubject(null);
  reset$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  resetTextEditor$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    private feedsService: FeedsService,
    private storeService: StoreService,
    private fileUploadService: FileUploadService
  ) {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    this.stores$ = this.storeService.getStores(search);

    this.channels$ = this.feedsService
      .getChannelsBySchoolId(1, 100, search)
      .startWith([{ label: '---' }])
      .map((channels) => {
        const _channels = [
          {
            label: '---',
            action: null
          }
        ];

        channels.forEach((channel) => {
          const _channel = {
            label: channel.name,
            action: channel.id
          };

          _channels.push(_channel);
        });

        return _channels;
      });
  }

  replyToThread({ message, message_image_url_list, school_id, store_id }): Promise<any> {
    let body = {
      school_id,
      store_id,
      comment: message,
      thread_id: this.threadId
    };

    if (message_image_url_list) {
      body = Object.assign({}, body, {
        comment_image_url_list: [...message_image_url_list]
      });
    }

    if (this.orientationId) {
      body = this.asCalendarFormat(body);
    }

    const groupWall$ = this.feedsService.replyToGroupThread(body);
    const campusWall$ = this.feedsService.replyToCampusThread(body);
    const stream$ = this._isCampusWallView ? groupWall$ : campusWall$;

    return stream$.toPromise();
  }

  postToWall(formData): Promise<any> {
    if (this.orientationId) {
      formData = this.asCalendarFormat(formData);
    }

    const groupWall$ = this.feedsService.postToGroupWall(formData);
    const campusWall$ = this.feedsService.postToCampusWall(formData);
    const stream$ = this._isCampusWallView ? groupWall$ : campusWall$;

    return stream$.toPromise();
  }

  asCalendarFormat(data) {
    delete data['store_id'];

    return { ...data, calendar_id: this.orientationId };
  }

  handleError({ status = 400 }) {
    const forbidden = this.cpI18n.translate('feeds_error_wall_is_disabled');
    const somethingWentWrong = this.cpI18n.translate('something_went_wrong');

    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        body: status === 403 ? forbidden : somethingWentWrong,
        class: 'danger',
        sticky: true,
        autoClose: true
      }
    });
  }

  onSubmit(data) {
    const submit = this.replyView
      ? this.replyToThread(this.parseData(data))
      : this.postToWall(this.parseData(data));

    submit
      .then((res) => {
        this.buttonData = { ...this.buttonData, disabled: false };

        this.resetFormValues();
        this.created.emit(res);
      })
      .catch((err) => {
        this.buttonData = { ...this.buttonData, disabled: false };

        this.handleError(err);
      });
  }

  parseData(data) {
    const _data = {
      post_type: data.post_type || null,
      store_id: data.store_id,
      school_id: this.session.g.get('school').id,
      message: data.message,
      message_image_url_list: data.message_image_url_list
    };

    if (this._isCampusWallView) {
      _data['group_id'] = this.groupId;
    }

    return _data;
  }

  resetFormValues() {
    if (!this.clubId && !this._isCampusWallView && !this.replyView) {
      this.form.controls['group_id'].setValue(null);
      this.form.controls['post_type'].setValue(null);
    }
    this.reset$.next(true);
    this.resetTextEditor$.next(true);
    this.form.controls['message'].setValue(null);
    this.form.controls['message_image_url_list'].setValue(null);
  }

  onContentChange({ body, withImage }) {
    this.form.controls['message'].setValue(body);

    if (!withImage) {
      this.form.controls['message_image_url_list'].setValue([]);
    }
  }

  onSelectedHost(host): void {
    this.form.controls['store_id'].setValue(host.value);
  }

  onSelectedChannel(channel): void {
    this.form.controls['post_type'].setValue(channel.action);
  }

  onFileUpload(file) {
    this.imageError = null;
    const validate = this.fileUploadService.validImage(file);

    if (!validate.valid) {
      this.imageError = validate.errors[0];

      return;
    }

    const headers = new Headers();
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    headers.append('Authorization', auth);

    this.fileUploadService.uploadFile(file, url, headers).subscribe((res) => {
      this.image$.next(res.image_url);
      this.form.controls['message_image_url_list'].setValue([res.image_url]);
    });
  }

  ngOnInit() {
    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('walls_button_create_post')
    };

    const defaultHost = this.session.defaultHost ? this.session.defaultHost.value : null;

    this.school = this.session.g.get('school');

    this.form = this.fb.group({
      group_id: [null],
      school_id: [this.session.g.get('school').id],
      store_id: [defaultHost, Validators.required],
      post_type: [this.replyView ? this.postType : null, Validators.required],
      message: [null, [Validators.required, Validators.maxLength(500)]],
      message_image_url_list: [null]
    });

    this.form.valueChanges.subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.form.valid };
    });

    this.isCampusWallView.subscribe((res) => {
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
        this.form.controls['store_id'].setValue(defaultHost);
      }

      this._isCampusWallView = false;
    });
  }
}
