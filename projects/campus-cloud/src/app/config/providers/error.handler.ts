import { ErrorHandler, Injectable } from '@angular/core';
import { get as _get } from 'lodash';

import { EnvService } from '@campus-cloud/config/env';
import { CPLogger } from '@campus-cloud/shared/services';
import { isSupported } from '@campus-cloud/shared/utils/browser';
import * as buildJson from '@projects/campus-cloud/src/assets/build.json';
import { DEV_SERVER_URL, LOCAL_PROD_URL } from '@campus-cloud/shared/constants';
import { environment } from '@projects/campus-cloud/src/environments/environment';

@Injectable()
export class CPErrorHandler extends ErrorHandler {
  constructor(private env: EnvService) {
    super();
    if (this.env.name !== 'development') {
      this.init();
    }
  }

  init() {
    const { commitId } = buildJson;
    CPLogger.init({
      environment: `${this.env.name} (${this.env.region})`,
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
    if (this.env.name === 'development') {
      throw err;
    }

    const chunkFailedMessage = /Loading chunk [\d]+ failed/;

    if (chunkFailedMessage.test(err.message)) {
      location.reload();
      return;
    }

    CPLogger.exception(err.originalError || err);
  }
}
