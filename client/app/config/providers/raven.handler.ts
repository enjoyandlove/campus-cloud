/*tslint:disable:max-line-length */
import { ErrorHandler } from '@angular/core';
import * as Raven from 'raven-js';
import { isProd } from './../env';

if (isProd) {
  Raven.config('https://0b6c76a5691d4b7399394aa79753acef@sentry.io/207033', {
    /**
     * ignore local development errors
     */

    ignoreUrls: [/localhost\:3030/],

    /**
     * ignoreErrors that match the following strings
     */
    ignoreErrors: [
      /^Uncaught (in promise): Error: TypeError: You provided 'undefined' where a stream was expected. You can provide an Observable, Promise, Array, or Iterable$/
    ]
  }).install();
}

export class RavenErrorHandler extends ErrorHandler {
  constructor() {
    super();
  }

  handleError(err: any): void {
    Raven.captureException(err.originalError || err);
  }
}
