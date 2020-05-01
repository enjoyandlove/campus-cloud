import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { map, tap, take, startWith, takeUntil, withLatestFrom } from 'rxjs/operators';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Subject, merge } from 'rxjs';
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
import { CPSession } from '@campus-cloud/session';
import { validThread } from '../../../validators';
import { FeedsService } from '../../../feeds.service';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { IItem } from '@campus-cloud/shared/components';
import { baseActionClass } from '@campus-cloud/store/base';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { ISnackbar, baseActions } from '@campus-cloud/store/base';
import { FeedsUtilsService, GroupType } from '../../../feeds.utils.service';
import { amplitudeEvents, MAX_UPLOAD_SIZE } from '@campus-cloud/shared/constants';
import { ICampusThread, ISocialGroupThread } from '@controlpanel/manage/feeds/model';
import { TextEditorDirective } from '@campus-cloud/shared/directives';
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

  @Input() replyView: boolean;
  @Input() feed: ICampusThread | ISocialGroupThread;

  @Output() created: EventEmitter<null> = new EventEmitter();

  stores$;
  channels$;
  hostType;
  buttonData;
  campusGroupId;
  form: FormGroup;
  maxImages = 4;
  expandGallery = false;
  reset$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  resetTextEditor$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  selectedItem: BehaviorSubject<null | IItem> = new BehaviorSubject(undefined);

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
    public session: CPSession,
    public cpI18n: CPI18nService,
    private cpI18nPipe: CPI18nPipe,
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

  addImageInputHandler(event: Event) {
    let files = Array.from((event.target as HTMLInputElement).files);

    files = files.filter((file: File) =>
      file.size > MAX_UPLOAD_SIZE ? this.imageUploadError({ file }) : file
    );

    if (!files.length) {
      return;
    }

    return this.addImages(files);
  }

  addImages(files: File[]) {
    const imageCtrl = this.form.get('message_image_url_list');

    // should be taken care of by the UI, just in case
    if (imageCtrl.value.length > this.maxImages) {
      return;
    }

    if (files.length + imageCtrl.value.length > this.maxImages) {
      const errorResponse = new HttpErrorResponse({ status: 400 });
      const errorMessage = this.cpI18nPipe.transform('t_shared_upload_error_max_items', 4);
      this.handleError(errorResponse, errorMessage);
    }

    files = files.slice(0, this.maxImages - imageCtrl.value.length);

    const fileUploads$ = merge(...files.map((f: File) => this.imageService.upload(f)));

    fileUploads$
      .pipe(
        takeUntil(this.destroy$),
        tap(({ image_url }: any) => {
          const images = imageCtrl.value;
          images.push(image_url);
          imageCtrl.setValue(images);
        })
      )
      .subscribe(() => {}, (err) => this.handleError(err));
  }

  removeImage(imgUrl: string) {
    const imagesCtrl: AbstractControl = this.form.get('message_image_url_list');
    let images: string[] = imagesCtrl.value;

    images = images.filter((imgeSrc) => imgeSrc !== imgUrl);

    imagesCtrl.setValue(images);
  }

  imageUploadError({ file }) {
    const error = new HttpErrorResponse({ status: 400 });
    const message = this.cpI18nPipe.transform('t_shared_image_upload_error_size', file.name);

    this.handleError(error, message);
  }

  replyToThread({ message, message_image_url_list, school_id, store_id }): Promise<any> {
    let body = {
      school_id,
      store_id,
      comment: message,
      thread_id: this.feed.id
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

  handleError(
    err: HttpErrorResponse,
    errorMessage = this.cpI18n.translate('something_went_wrong')
  ) {
    const { status } = err;

    const forbidden = this.cpI18n.translate('feeds_error_wall_is_disabled');

    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        body: status === 403 ? forbidden : errorMessage,
        class: 'danger',
        sticky: true,
        autoClose: true
      }
    });
  }

  launchSuccessSnackBar(newThread) {
    this.store
      .pipe(select(fromStore.getViewFilters))
      .pipe(
        take(1),
        withLatestFrom(this.store.pipe(select(fromStore.getSocialPostCategories))),
        tap(([filters, socialPostCategories]) => {
          const {
            end,
            group,
            users,
            start,
            postType,
            searchTerm,
            flaggedByUser,
            flaggedByModerators
          } = filters;

          const filterByGroup = !!group;
          const isSearching = searchTerm !== '';
          const filterBySocialPost = !!postType;
          const filterByUsers = users.length > 0;
          const isCampusWall = !group && !postType;
          const filterByDate = Boolean(start) && Boolean(end);
          const filteredByStatus = flaggedByUser || flaggedByModerators;
          const postedInSameGroup = filterByGroup && group.id === newThread.extern_poster_id;
          const postedInSamePostCategory =
            filterBySocialPost && postType.id === newThread.post_type;

          const needsSnackBar = isSearching || filterByDate || filterByUsers || filteredByStatus;

          if (!needsSnackBar && (isCampusWall || postedInSameGroup || postedInSamePostCategory)) {
            return;
          }

          let channelName = this.cpI18nPipe.transform('t_feeds_campus_wall');
          if (group) {
            channelName = group.name;
          } else if (postType) {
            const postCategory = socialPostCategories.find((c) => c.id === newThread.post_type);
            channelName = _get(postCategory, 'name', '');
          }

          this.store.dispatch(
            new baseActionClass.SnackbarSuccess({
              body: this.cpI18nPipe.transform(
                't_walls_snackbar_success_posted_with_filters',
                channelName
              )
            })
          );
        })
      )
      .subscribe();
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
          this.launchSuccessSnackBar(res);
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

    this.selectedItem.next(undefined);

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

  onSelectedHost(host): void {
    this.hostType = host.hostType;
    this.form.controls['store_id'].setValue(host.value);
  }

  onSelectedChannel(channel): void {
    this.form.controls['post_type'].setValue(channel.action);
  }

  trackAmplitudeEvents(feed) {
    let threadAmplitude;
    const { isCampusWallView } = this.state;
    const threadType = this.replyView ? 'Comment' : 'Post';
    const host_type = isCampusWallView ? this.hostType : null;

    if (this.replyView) {
      this.cpTracking.amplitudeEmitEvent(
        amplitudeEvents.WALL_SUBMITTED_COMMENT,
        this.feedsAmplitudeService.getWallPostCommentAmplitude(feed, host_type)
      );
    } else {
      this.cpTracking.amplitudeEmitEvent(
        amplitudeEvents.WALL_SUBMITTED_POST,
        this.feedsAmplitudeService.getWallPostFeedAmplitude(feed, host_type)
      );
    }

    threadAmplitude = this.feedsAmplitudeService.getWallThreadAmplitude(feed, threadType);
    threadAmplitude['host_type'] = host_type;
    delete threadAmplitude['likes'];

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.COMMUNITY_CREATED_THREAD, threadAmplitude);
  }

  buildForm() {
    this.form = this.fb.group(
      {
        group_id: [null],
        school_id: [this.session.g.get('school').id],
        store_id: [this.defaultHost, Validators.required],
        message_image_url_list: [[]],
        message: ['', Validators.maxLength(500)]
      },
      { validators: validThread }
    );

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.form.valid };
    });
  }

  ngOnInit() {
    this.buildForm();
    this.hostType = this.session.defaultHost ? this.session.defaultHost.hostType : null;
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
            isCampusWallView: !group,
            postType: _get(postType, 'id', null),
            groupType: _get(group, 'group_type', null)
          });

          if (postType) {
            this.selectedItem.next({
              action: null,
              label: postType.name
            });
          } else {
            this.selectedItem.next(undefined);
          }

          if (this.form) {
            if (group) {
              this.form.removeControl('post_type');
              this.form.get('group_id').setValue(group.id);
              this.form.get('store_id').setValue(group.related_obj_id);
            } else {
              this.form.registerControl('post_type', new FormControl(null, Validators.required));
              this.form.controls['store_id'].setValue(this.defaultHost);

              // when Channels filters is set to a Social Post Category
              if (postType && !this.replyView) {
                this.form.get('post_type').setValue(postType.id);
              }

              // on reply mode use the feed's post type
              if (this.replyView && this.feed) {
                this.form.get('post_type').setValue(this.feed.post_type);
              }
            }
          }
        })
      )
      .subscribe();

    this.buttonData = {
      disabled: true,
      class: 'primary',
      text: this.cpI18n.translate('walls_button_create_post')
    };
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
