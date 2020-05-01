import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { CPI18nService } from '@campus-cloud/shared/services';
import { baseActionClass, ISnackbar } from '@campus-cloud/store/base';

enum FeedbackErrors {
  already_submitted = 'feedback already given'
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackUtilsService {
  constructor(private cpI18n: CPI18nService, private store: Store<ISnackbar>) {}

  static isFeedbackAlreadySubmitted(err) {
    return err.status === 403 && err.error.response === FeedbackErrors.already_submitted;
  }

  handleError() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
  }
}
