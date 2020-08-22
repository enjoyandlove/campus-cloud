import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ApiService } from '@campus-cloud/base';
import { Store } from '@ngrx/store';
import { baseActionClass, ISnackbar } from '@campus-cloud/store';
import { CPI18nService } from '@campus-cloud/shared/services';
import { CPSession } from '@campus-cloud/session';
import { INotificationTemplate } from '@controlpanel/contact-trace/health-pass/notification-templates/notification-template';

@Injectable({
  providedIn: 'root'
})
export class NotificationTemplateSettingsService {

  constructor(
    private api: ApiService,
    private store: Store<ISnackbar>,
    private cpI18n: CPI18nService,
    private session: CPSession
  ) { }

  private handleError() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
  }


  getAll() {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CONTACT_TRACE_ANNOUNCEMENT_TEMPLATE}/`;

    const params = new HttpParams().set('school_id', this.session.school.id.toString());

    return this.api.get(url, params).pipe(
      catchError((error) => {
        this.handleError();
        return throwError(error);
      })
    );
  }

  update(template: INotificationTemplate) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CONTACT_TRACE_ANNOUNCEMENT_TEMPLATE}/`;

    const params = new HttpParams().set('school_id', this.session.school.id.toString());

    return this.api.update(url, template, params).pipe(
      catchError((error) => {
        this.handleError();
        return throwError(error);
      })
    );
  }
}
