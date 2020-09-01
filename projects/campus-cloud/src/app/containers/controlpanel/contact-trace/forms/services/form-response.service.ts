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
export class FormResponseService {
  constructor(
    private api: ApiService,
    private store: Store<ISnackbar>,
    private cpI18n: CPI18nService
  ) {}

  getFormResponse(responseId: number, params?: HttpParams): Observable<FormResponse> {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.FORM_RESPONSE}/${responseId}`;

    return this.api.get(url, params).pipe(
      catchError((error) => {
        this.handleError();
        return throwError(error);
      })
    );
  }

  getFormResponseWithFilter(
    formId: number,
    nonTerminalBlockId: number,
    terminalBlockId: number,
    start: number,
    end: number
  ): Observable<FormResponse[] | any> {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.FORM_RESPONSE}/${start};${end}`;

    const params = new HttpParams()
      .set('form_id', formId ? '' + '' + formId : null)
      .set('form_block_id', nonTerminalBlockId ? '' + '' + nonTerminalBlockId : null)
      .set('terminal_form_block_id', terminalBlockId ? '' + '' + terminalBlockId : null);

    return this.api.get(url, params).pipe(
      catchError((error) => {
        this.handleError();
        return throwError(error);
      })
    );
  }

  getFullFormResponse(
    formId: number,
    nonTerminalBlockId: number,
    terminalBlockId: number
  ): Observable<FormResponse[] | any> {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.FORM_RESPONSE}/`;

    const params = new HttpParams()
      .set('form_id', formId ? '' + '' + formId : null)
      .set('include_full_data', '1')
      .set('form_block_id', nonTerminalBlockId ? '' + '' + nonTerminalBlockId : null)
      .set('terminal_form_block_id', terminalBlockId ? '' + '' + terminalBlockId : null)
      .set('all', '1');

    return this.api.get(url, params).pipe(
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
