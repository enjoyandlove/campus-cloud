import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { ERROR_CODES } from '../constants';
import { ALERT_DEFAULT, ALERT_PUSH } from '../../reducers/alert.reducer';

@Injectable()
export class ErrorService {
  ERROR_CODES = ERROR_CODES;

  constructor(
    private store: Store<any>
  ) { }

  // public handleResponse(data) {
  //   if (data.isError) {
  //     this.handleError(data);
  //   } else {
  //     this.handleSuccess(data);
  //   }
  // }

  handleSuccess(res) {
    this.store.dispatch({
      type: ALERT_PUSH,
      payload: {
        class: 'alert-success',
        body: res.body || 'All good! Your request was processed successfully.'
      }
    });
  }

  handleError(err) {
    const message = `#${err.code} ${ERROR_CODES[err.code]}` || `No message for error #${err.code}`;

    this.store.dispatch({
      type: ALERT_PUSH,
      payload: {
        class: 'alert-danger',
        body: message
      }
    });
  }

  public clearErrors() {
    this.store.dispatch({ type: ALERT_DEFAULT });
  }
}
