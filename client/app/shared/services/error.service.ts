import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { STATUS } from '../constants';
import { ALERT_DEFAULT, ALERT_PUSH } from '../../reducers/alert.reducer';

@Injectable()
export class ErrorService {
  REASON;

  constructor(
    private store: Store<any>
  ) {
    this.REASON = STATUS;
  }

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
        class: 'success',
        body: res.body || 'All good! Your request was processed successfully.'
      }
    });
  }

  handleError(err) {
    this.store.dispatch({
      type: ALERT_PUSH,
      payload: {
        class: 'danger',
        body: err.reason
      }
    });
  }

  public clearErrors() {
    this.store.dispatch({ type: ALERT_DEFAULT });
  }
}
