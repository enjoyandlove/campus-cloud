/*tslint:disable:max-line-length */
import { ErrorHandler } from '@angular/core';
import { get as _get } from 'lodash';

import { CPLogger } from '@shared/services';
import { environment } from '@client/environments/environment';
import { DEV_SERVER_URL, LOCAL_PROD_URL } from '@shared/constants';

export class CPErrorHandler extends ErrorHandler {
  constructor() {
    super();
    this.init();
  }

  init() {
    CPLogger.init({
      environment: environment.envName,
      blacklistUrls: [DEV_SERVER_URL, LOCAL_PROD_URL],
      dsn: environment.keys.sentryDsn,
      beforeSend(event) {
        const e2eUserId = '18845';
        return event.user.id === e2eUserId ? null : event;
      }
    });
  }

  handleError(err: any): void {
    CPLogger.exception(err.originalError || err);
  }
}
