import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '@campus-cloud/base';
import { baseActionClass, ISnackbar } from '@campus-cloud/store';
import { Store } from '@ngrx/store';
import { CPI18nService } from '@campus-cloud/shared/services';
import { ExposureNotification } from '../.';

@Injectable({
  providedIn: 'root'
})
export class ExposureNotificationService {
  constructor(
    private api: ApiService,
    private store: Store<ISnackbar>,
    private cpI18n: CPI18nService
  ) {}

  searchNotifications(
    start: number,
    end: number,
    params: HttpParams
  ): Observable<ExposureNotification[] | any> {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ANNOUNCEMENT}/${start};${end}`;

    return this.api.get(url, params).pipe(
      catchError((error) => {
        this.handleError();
        return throwError(error);
      })
    );
  }

  deleteNotification(notificationId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ANNOUNCEMENT}/${notificationId}`;

    return this.api.delete(url, search).pipe(
      catchError((error) => {
        this.handleError();
        return throwError(error);
      })
    );
  }

  private handleError() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
  }
}
