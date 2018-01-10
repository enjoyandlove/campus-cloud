import { ErrorHandler } from '@angular/core';
import * as Raven from 'raven-js';

Raven
  .config('https://0b6c76a5691d4b7399394aa79753acef@sentry.io/207033')
  .install();

export class RavenErrorHandler extends ErrorHandler {

  constructor() {
    super();
  }

  handleError(err: Error): void {
    Raven.captureException(err);
  }
}
