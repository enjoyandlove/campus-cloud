import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { FormBlock } from '@controlpanel/contact-trace/forms/models';
import { takeUntil, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { baseActions } from '@campus-cloud/store';
import { CPI18nService, ImageService } from '@campus-cloud/shared/services';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { Store } from '@ngrx/store';
import * as fromStore from '@controlpanel/manage/feeds/store';

@Component({
  selector: 'cp-form-block-image-selector',
  templateUrl: './form-block-image-selector.component.html',
  styleUrls: ['./form-block-image-selector.component.scss']
})
export class FormBlockImageSelectorComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  @Input() formBlock: FormBlock;
  loadingFile = false;

  constructor(
    private imageService: ImageService,
    private cpI18n: CPI18nService,
    private cpI18nPipe: CPI18nPipe,
    private store: Store<fromStore.IWallsState>
  ) {}

  ngOnDestroy() {
    // Do this to un-subscribe all subscriptions on this page
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {}

  addImages(files: File[]) {
    const {validFiles, errors} = this.imageService.getValidFilesAndErrors(files)
    if (errors.length) {
      errors.forEach(error  =>  this.imageUploadError(error));
    }

    if (!validFiles.length) {
      return;
    }

    const fileUploads$ = merge(...validFiles.map((f: File) => this.imageService.upload(f)));

    fileUploads$
      .pipe(
        takeUntil(this.unsubscribe),
        tap(({ image_url }: any) => {
          this.formBlock.image_url = image_url;
        })
      )
      .subscribe(() => {
      }, (err) => this.handleError(err));
  }

  handleError(
    err: HttpErrorResponse,
    errorMessage = this.cpI18n.translate('something_went_wrong')
  ) {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        body: errorMessage,
        class: 'danger',
        sticky: true,
        autoClose: true
      }
    });
  }

  removeImage() {
    this.formBlock.image_url = null;
  }

  imageUploadError(errorMessage) {
    const error = new HttpErrorResponse({ status: 400 });

    this.handleError(error, errorMessage);
  }
}
