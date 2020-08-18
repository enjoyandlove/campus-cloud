import {
  Input,
  NgZone,
  OnInit,
  Output,
  Component,
  ViewChild,
  OnDestroy,
  EventEmitter,
  AfterViewInit,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  map,
  tap,
  take,
  filter,
  switchMap,
  takeUntil,
  startWith,
  withLatestFrom
} from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { TextEditorDirective } from '@ready-education/ready-ui/forms';
import { Observable, merge, Subject, combineLatest } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { baseActions } from '@campus-cloud/store/base';
import { Store, select } from '@ngrx/store';
import { isEqual } from 'lodash';

import * as fromStore from '../../../store';
import { validThread } from '../../../validators';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { FeedsService } from '@controlpanel/manage/feeds/feeds.service';
import { MAX_UPLOAD_SIZE, amplitudeEvents } from '@campus-cloud/shared/constants';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';
import { CPTrackingService, ImageService, CPI18nService } from '@campus-cloud/shared/services';

import {
  ICampusThread,
  ISocialGroupThread,
  ICampusThreadComment,
  ISocialGroupThreadComment
} from '@controlpanel/manage/feeds/model';

@Component({
  selector: 'cp-feed-edit',
  templateUrl: './feed-edit.component.html',
  styleUrls: ['./feed-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedEditComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('editor', { static: true }) editor: TextEditorDirective;

  @Input()
  feed: ICampusThread | ICampusThreadComment | ISocialGroupThread | ISocialGroupThreadComment;

  @Output()
  updated: EventEmitter<
    ICampusThread | ICampusThreadComment | ISocialGroupThread | ISocialGroupThreadComment
  > = new EventEmitter();

  maxImages = 4;
  form: FormGroup;
  showToolbar = false;
  destroy$ = new Subject();
  submitting = new Subject();
  updateThread$: Observable<any>;
  hasChanged$: Observable<boolean>;
  disableSubmit$: Observable<boolean>;

  constructor(
    private zone: NgZone,
    private fb: FormBuilder,
    private cpI18n: CPI18nService,
    private cpI18nPipe: CPI18nPipe,
    private feedService: FeedsService,
    private imageService: ImageService,
    private cpTracking: CPTrackingService,
    private store: Store<fromStore.IWallsState>,
    private feedsAmplitudeService: FeedsAmplitudeService
  ) {}

  ngOnInit(): void {
    const images = this.feed.image_url_list.filter((a) => a);
    const message = 'message' in this.feed ? this.feed.message : this.feed.comment;

    this.form = this.fb.group(
      {
        message: [message, Validators.maxLength(500)],
        message_image_url_list: [images]
      },
      {
        validators: validThread
      }
    );

    this.hasChanged$ = this.form.valueChanges.pipe(
      map(() => {
        const { message, message_image_url_list } = this.form.controls;
        const sameMessage =
          'message' in this.feed
            ? this.feed.message === message.value
            : this.feed.comment === message.value;

        return (
          !sameMessage ||
          !isEqual(this.feed.image_url_list.filter((a) => a), message_image_url_list.value)
        );
      }),
      startWith(false)
    );

    this.updateThread$ = this.store.pipe(select(fromStore.getEditing)).pipe(
      filter((editing) => editing !== null),
      withLatestFrom(this.store.pipe(select(fromStore.getViewFilters))),
      switchMap(([{ type }, { group }]) => {
        if (type === 'COMMENT') {
          const { message, message_image_url_list } = this.form.value;
          const body = {
            comment: message,
            comment_image_url_list: message_image_url_list
          };
          return group
            ? this.feedService.updateGroupWallComment(this.feed.id, body)
            : this.feedService.updateCampusWallComment(this.feed.id, body);
        }
        return group
          ? this.feedService.updateGroupWallThread(this.feed.id, this.form.value)
          : this.feedService
              .updateCampusWallThread(this.feed.id, this.form.value)
              .pipe(tap((thread) => this.store.dispatch(fromStore.updateThread({ thread }))));
      })
    );

    const formChanges$ = combineLatest([
      this.form.valueChanges.pipe(map(() => this.form.valid)),
      this.hasChanged$
    ]).pipe(map(([valid, hasChanged]) => !(valid && hasChanged)));

    this.disableSubmit$ = merge(formChanges$, this.submitting.asObservable() as Observable<
      boolean
    >).pipe(startWith(true));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    const message = 'message' in this.feed ? this.feed.message : this.feed.comment;
    this.zone.runOutsideAngular(() => this.editor.quill.setText(message, 'silent'));
  }

  cancelHandler() {
    this.store.dispatch(fromStore.setEdit({ editing: null }));
  }

  onTextChange() {
    this.form.get('message').setValue(this.editor.quill.getText().trim());
  }

  addImageInputHandler(event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files);

    return this.addImages(files);
  }

  addImages(files: File[]) {
    const {validFiles, errors} = this.imageService.getValidFilesAndErrors(files);
    if (errors.length) {
      errors.forEach(error => this.imageUploadError(error));
    }
    if (!validFiles.length) {
      return;
    }

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

  imageUploadError(errorMessage: string) {
    const error = new HttpErrorResponse({ status: 400 });

    this.handleError(error, errorMessage);
  }

  submitHandler() {
    this.submitting.next(true);
    this.updateThread$.pipe(take(1)).subscribe(
      (res) => {
        this.trackEditEvent(res);
        this.updated.emit(res);
        this.submitting.next(false);
        this.store.dispatch(fromStore.setEdit({ editing: null }));
      },
      (err) => {
        this.submitting.next(false);
        this.handleError(err);
      }
    );
  }

  trackEditEvent(feed) {
    this.store
      .pipe(select(fromStore.getEditing))
      .pipe(take(1))
      .subscribe(({ type }) => {
        const amplitude = this.feedsAmplitudeService.getWallThreadAmplitude(
          feed,
          type === 'COMMENT' ? 'Comment' : 'Post'
        );
        this.cpTracking.amplitudeEmitEvent(amplitudeEvents.COMMUNITY_EDITED_THREAD, amplitude);
      });
  }
}
