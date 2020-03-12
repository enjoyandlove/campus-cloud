import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith, takeUntil, tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { get as _get } from 'lodash';
import {
  Input,
  OnInit,
  Output,
  Component,
  OnDestroy,
  ViewChild,
  EventEmitter
} from '@angular/core';

import * as fromStore from '../../../store';

import { ISocialGroup } from '../../../model';
import { validThread } from '../../../validators';
import { CPSession } from '@campus-cloud/session';
import { FeedsService } from '../../../feeds.service';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { ISnackbar, baseActions } from '@campus-cloud/store/base';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { FeedsUtilsService, GroupType } from '../../../feeds.utils.service';
import { TextEditorDirective } from '@projects/campus-cloud/src/app/shared/directives';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';
import {
  ImageService,
  StoreService,
  CPI18nService,
  CPTrackingService
} from '@campus-cloud/shared/services';

interface IState {
  postType: any;
  groupType: GroupType;
  isCampusWallView: boolean;
  group: ISocialGroup | null;
}

@Mixin([Destroyable])
@Component({
  selector: 'cp-feed-input-box',
  templateUrl: './feed-input-box.component.html',
  styleUrls: ['./feed-input-box.component.scss']
})
export class FeedInputBoxComponent implements OnInit, OnDestroy {
  @ViewChild(TextEditorDirective, { static: true }) private editor: TextEditorDirective;

  @Input() threadId: number;
  @Input() replyView: boolean;

  @Output() created: EventEmitter<null> = new EventEmitter();

  stores$;
  channels$;
  hostType;
  imageError;
  buttonData;
  campusGroupId;
  form: FormGroup;
  image$: BehaviorSubject<string> = new BehaviorSubject(null);
  reset$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  resetTextEditor$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  state$: BehaviorSubject<IState> = new BehaviorSubject({
    group: null,
    postType: null,
    groupType: null,
    isCampusWallView: false
  });

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    public cpI18n: CPI18nService,
    public utils: FeedsUtilsService,
    private imageService: ImageService,
    private feedsService: FeedsService,
    private storeService: StoreService,
    public cpTracking: CPTrackingService,
    public feedsAmplitudeService: FeedsAmplitudeService,
    public store: Store<ISnackbar | fromStore.IWallsState>
  ) {}

  get state(): IState {
    return this.state$.value;
  }

  get defaultHost() {
    return this.session.defaultHost ? this.session.defaultHost.value : null;
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
    const { groupType, isCampusWallView } = this.state;

    if (groupType === GroupType.orientation) {
      body = this.asCalendarFormat(body);
    }

    const groupWall$ = this.feedsService.replyToGroupThread(body);
    const campusWall$ = this.feedsService.replyToCampusThread(body);
    const stream$ = isCampusWallView ? campusWall$ : groupWall$;

    return stream$.toPromise();
  }

  postToWall(formData): Promise<any> {
    const { groupType, isCampusWallView } = this.state;
    if (groupType === GroupType.orientation) {
      formData = this.asCalendarFormat(formData);
    }

    const groupWall$ = this.feedsService.postToGroupWall(formData);
    const campusWall$ = this.feedsService.postToCampusWall(formData);
    const stream$ = isCampusWallView ? campusWall$ : groupWall$;

    return stream$.toPromise();
  }

  asCalendarFormat(data) {
    const { store_id, ...rest } = data;
    return { ...rest, calendar_id: store_id };
  }

  handleError({ status = 400 }) {
    const forbidden = this.cpI18n.translate('feeds_error_wall_is_disabled');
    const somethingWentWrong = this.cpI18n.translate('something_went_wrong');

    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        body: status === 403 ? forbidden : somethingWentWrong,
        class: 'danger',
        sticky: true,
        autoClose: true
      }
    });
  }

  onSubmit(data) {
    const submit = this.replyView ? this.replyToThread(data) : this.postToWall(data);

    submit
      .then((res) => {
        this.trackAmplitudeEvents(res);
        this.buttonData = { ...this.buttonData, disabled: false };
        if (this.replyView) {
          this.store.dispatch(fromStore.addComment({ comment: res }));
        } else {
          this.store.dispatch(fromStore.addThread({ thread: res }));
        }
        this.resetFormValues();
        this.created.emit(res);
      })
      .catch((err) => {
        this.buttonData = { ...this.buttonData, disabled: false };

        this.handleError(err);
      });
  }

  resetFormValues() {
    const { group, isCampusWallView } = this.state;

    if (!group && !isCampusWallView && !this.replyView) {
      this.form.controls['group_id'].setValue(null);
      this.form.controls['post_type'].setValue(null);
    }
    this.editor.clear();
    this.reset$.next(true);
    this.resetTextEditor$.next(true);
    this.form.controls['message'].setValue('');
    this.form.controls['message_image_url_list'].setValue([]);
  }

  onDeleteImage() {
    this.form.get('message_image_url_list').setValue([]);
  }

  onSelectedHost(host): void {
    this.hostType = host.hostType;
    this.form.controls['store_id'].setValue(host.value);
  }

  onSelectedChannel(channel): void {
    this.form.controls['post_type'].setValue(channel.action);
  }

  onFileUpload(file) {
    this.imageError = null;
    this.imageService.upload(file).subscribe(
      ({ image_url }: any) => {
        this.image$.next(image_url);
        this.form.controls['message_image_url_list'].setValue([image_url]);
        this.trackUploadImageEvent();
      },
      (err) => {
        this.imageError = err.message || this.cpI18n.translate('something_went_wrong');
      }
    );
  }

  trackUploadImageEvent() {
    const properties = this.cpTracking.getAmplitudeMenuProperties();

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.UPLOADED_PHOTO, properties);
  }

  trackAmplitudeEvents(data) {
    let eventName;
    let eventProperties;

    eventName = amplitudeEvents.WALL_SUBMITTED_POST;

    eventProperties = {
      ...this.feedsAmplitudeService.getWallAmplitudeProperties(),
      post_id: data.id,
      host_type: this.hostType,
      upload_image: FeedsAmplitudeService.hasImage(data.has_image)
    };

    if (this.replyView) {
      eventName = amplitudeEvents.WALL_SUBMITTED_COMMENT;

      eventProperties = {
        ...eventProperties,
        comment_id: data.id
      };

      delete eventProperties['post_id'];
      delete eventProperties['post_type'];
    }

    this.cpTracking.amplitudeEmitEvent(eventName, eventProperties);
  }

  setDefaultHostWallCategory(isCampusWallView) {
    const host_type = this.session.defaultHost ? this.session.defaultHost.hostType : null;
    this.hostType = isCampusWallView ? null : host_type;
  }

  buildForm() {
    this.form = this.fb.group(
      {
        group_id: [null],
        school_id: [this.session.g.get('school').id],
        store_id: [this.defaultHost, Validators.required],
        post_type: [null],
        message: ['', [Validators.maxLength(500)]],
        message_image_url_list: [[]]
      },
      { validators: validThread }
    );

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.form.valid };
    });
  }

  ngOnInit() {
    this.buildForm();

    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.stores$ = this.storeService.getStores(search);

    this.channels$ = this.feedsService.getChannelsBySchoolId(1, 100, search).pipe(
      startWith([{ label: '---' }]),
      map((channels: any[]) => {
        const _channels = [
          {
            label: '---',
            action: null
          }
        ];

        channels.forEach((channel: any) => {
          const _channel = {
            label: channel.name,
            action: channel.id
          };

          _channels.push(_channel);
        });

        return _channels;
      })
    );

    this.store
      .pipe(select(fromStore.getViewFilters))
      .pipe(
        takeUntil(this.destroy$),
        tap(({ postType, group }) => {
          this.state$.next({
            group,
            postType: _get(postType, 'id', null),
            isCampusWallView: !postType && !group,
            groupType: _get(group, 'group_type', null)
          });

          if (this.form) {
            const { isCampusWallView } = this.state;
            this.setDefaultHostWallCategory(isCampusWallView);

            if (this.replyView && postType) {
              this.form.get('post_type').setValue(postType.id);
            }

            if (group) {
              this.form.removeControl('post_type');
              this.form.get('group_id').setValue(group.id);
              this.form.get('store_id').setValue(group.related_obj_id);
            } else {
              this.form.registerControl('post_type', new FormControl(null, Validators.required));
              this.form.controls['store_id'].setValue(this.defaultHost);
            }
          }
        })
      )
      .subscribe();

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('walls_button_create_post')
    };
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
