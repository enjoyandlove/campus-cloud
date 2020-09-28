import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { FormResponse } from '@controlpanel/contact-trace/forms/models';
import { catchError } from 'rxjs/operators';
import { ApiService } from '@campus-cloud/base';
import { baseActionClass, ISnackbar } from '@campus-cloud/store';
import { Store } from '@ngrx/store';
import { CPI18nService } from '@campus-cloud/shared/services';

@Injectable({
  providedIn: 'root'
})
export class FormResponseStatsService {
  constructor(
    private api: ApiService,
    private store: Store<ISnackbar>,
    private cpI18n: CPI18nService
  ) {}

  getFormResponse(params?: HttpParams): Observable<FormResponse> {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.FORM_RESPONSE_STATS}/`;

    return this.api.get(url, params).pipe(
      catchError((error) => {
        this.store.dispatch(
          new baseActionClass.SnackbarError({
            body: this.cpI18n.translate('something_went_wrong')
          })
        );
        return throwError(error);
      })
    );
  }
}
