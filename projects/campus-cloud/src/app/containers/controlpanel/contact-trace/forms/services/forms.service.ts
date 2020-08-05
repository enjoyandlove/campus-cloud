import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Form } from '../models';
import { catchError, distinctUntilChanged, tap } from 'rxjs/operators';
import { ApiService } from '@campus-cloud/base';
import { HttpParams } from '@angular/common/http';
import { baseActionClass, ISnackbar } from '@campus-cloud/store';
import { Store } from '@ngrx/store';
import { CPI18nService } from '@campus-cloud/shared/services';
import { CPSession } from '@campus-cloud/session';
import { FormsHelperService } from '@controlpanel/contact-trace/forms/services/forms-helper.service';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  formBeingEdited = new BehaviorSubject<Form>(null);

  constructor(
    private api: ApiService,
    private store: Store<ISnackbar>,
    private cpI18n: CPI18nService,
    private session: CPSession
  ) {}

  getFormBeingEdited(): Observable<Form> {
    return this.formBeingEdited.asObservable().pipe(distinctUntilChanged());
  }

  setFormBeingEdited(form: Form): void {
    this.formBeingEdited.next(form);
  }

  searchForms(start: number, end: number, params: HttpParams): Observable<Form[]> {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.FORMS}/${start};${end}`;

    return this.api.get(url, params).pipe(
      catchError((error) => {
        this.handleError();
        return of(null);
      })
    );
  }

  getTemplateForms(): Observable<Form[]> {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.FORMS}/`;
    const params = new HttpParams()
      .set('school_id', this.session.g.get('school').id)
      .set('is_template', 'true');

    return this.api.get(url, params).pipe(
      catchError((error) => {
        this.handleError();
        return of(null);
      })
    );
  }

  createForm(form: Form, params: HttpParams): Observable<Form> {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.FORMS}/`;

    FormsHelperService.formatObjectBeforeSave(form);

    return this.api.post(url, form, params).pipe(
      catchError((error) => {
        this.handleError();
        return of(null);
      })
    );
  }

  updateForm(form: Form, params: HttpParams): Observable<Form> {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.FORMS}/${form.id}`;

    FormsHelperService.formatObjectBeforeSave(form);

    return this.api.update(url, form, params).pipe(
      catchError((error) => {
        this.handleError();
        return of(null);
      })
    );
  }

  getForm(formId: number, params: HttpParams): Observable<Form> {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.FORMS}/${formId}`;

    return this.api.get(url, params).pipe(
      tap((form) => FormsHelperService.convertIdsInFormFromServerToIndexes(form)),
      catchError((error) => {
        this.handleError();
        return of(error);
      })
    );
  }

  deleteForm(formId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.FORMS}/${formId}`;

    return this.api.delete(url, search);
  }

  private handleError() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
  }
}
