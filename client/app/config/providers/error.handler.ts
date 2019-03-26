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
        const userId = _get(event, ['user', 'id'], null);

        return userId === e2eUserId ? null : event;
      }
    });
  }

  handleError(err: any): void {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;

    if (chunkFailedMessage.test(err.message)) {
      CPLogger.log('caught loading chunk error');
      location.reload();
      return;
    }

    CPLogger.exception(err.originalError || err);
  }
}
