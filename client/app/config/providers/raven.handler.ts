import { ErrorHandler } from '@angular/core';
import * as Raven from 'raven-js';

import { isProd } from './../env/index';

Raven
  .config('https://0b6c76a5691d4b7399394aa79753acef@sentry.io/207033')
  .install();

export class RavenErrorHandler extends ErrorHandler {

  constructor() {
    super();
  }

  handleError(err: Error): void {
    if (isProd) {
      Raven.captureException(err);
    } else {
      super.handleError(err);
    }
  }
}
