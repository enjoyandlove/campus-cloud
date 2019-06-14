import * as Sentry from '@sentry/browser';

/**
 * Wrapper for all Sentry stuff
 */
export class CPLogger {
  static init(options: Sentry.BrowserOptions = {}) {
    Sentry.init(options);
  }

  static setUser(user: Sentry.User) {
    Sentry.configureScope((scope) => {
      scope.setUser(user);
    });
  }

  static showFeedBackForm(options: Sentry.ReportDialogOptions = {}) {
    Sentry.showReportDialog(options);
  }

  static log(message: string, level: Sentry.Severity = Sentry.Severity.Info) {
    Sentry.captureMessage(message, level);
  }

  static exception(exception: any) {
    Sentry.captureException(exception);
  }
}
