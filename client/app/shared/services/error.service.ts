import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  ALERT_CLASS,
  ALERT_DEFAULT,
  ALERT_PUSH,
} from '../../reducers/alert.reducer';

@Injectable()
export class ErrorService {
  constructor(private store: Store<any>) {}

  trackException(err) {
    ga('send', 'exception', {
      exDescription: err.message,
      exFatal: false,
    });
  }

  handleResponse(res) {
    if (res.code.startsWith(4)) {
      this.handleError(res);
    } else {
      this.handleSuccess(res);
    }
  }

  handleWarning(res) {
    this.store.dispatch({
      type: ALERT_PUSH,
      payload: {
        body: res.reason,
        class: ALERT_CLASS.WARNING,
      },
    });
  }

  handleInfo(res) {
    this.store.dispatch({
      type: ALERT_PUSH,
      payload: {
        body: res.reason,
        class: ALERT_CLASS.INFO,
      },
    });
  }

  handleSuccess(res) {
    this.store.dispatch({
      type: ALERT_PUSH,
      payload: {
        class: ALERT_CLASS.SUCCESS,
        body: res.body || 'All good! Your request was processed successfully.',
      },
    });
  }

  handleError(err) {
    this.store.dispatch({
      type: ALERT_PUSH,
      payload: {
        body: err.reason,
        class: ALERT_CLASS.DANGER,
      },
    });
  }

  clearErrors() {
    this.store.dispatch({ type: ALERT_DEFAULT });
  }
}
