import { ErrorHandler } from '@angular/core';
import { get as _get } from 'lodash';

import { CPLogger } from '@campus-cloud/shared/services';
import { isSupported } from '@campus-cloud/shared/utils/browser';
import * as buildJson from '@projects/campus-cloud/src/assets/build.json';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import { DEV_SERVER_URL, LOCAL_PROD_URL } from '@campus-cloud/shared/constants';

export class CPErrorHandler extends ErrorHandler {
  constructor() {
    super();
    this.init();
  }

  init() {
    const { commitId } = buildJson;
    CPLogger.init({
      environment: environment.envName,
      release: `campus-cloud@${commitId}`,
      blacklistUrls: [DEV_SERVER_URL, LOCAL_PROD_URL],
      dsn: environment.keys.sentryDsn,
      beforeSend(event) {
        let supportedBrowser = true;
        try {
          supportedBrowser = isSupported();
        } catch (error) {}

        if (!supportedBrowser) {
          return null;
        }
        const e2eUserId = '18845';
        const userId = _get(event, ['user', 'id'], null);

        return userId === e2eUserId ? null : event;
      }
    });
  }

  handleError(err: any): void {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;

    if (chunkFailedMessage.test(err.message)) {
      location.reload();
      return;
    }

    CPLogger.exception(err.originalError || err);
  }
}
