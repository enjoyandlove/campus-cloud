import { Component, OnInit } from '@angular/core';
import { baseActions, IHeader } from '@campus-cloud/store';
import { Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsService } from '../services';
import { Form } from '../models';
import { CPSession } from '@campus-cloud/session';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'cp-forms-create',
  templateUrl: './forms-create.component.html',
  styleUrls: ['./forms-create.component.scss']
})
export class FormsCreateComponent implements OnInit {
  private unsubscribe: Subject<void> = new Subject();
  form: Form;
  formId: number;

  constructor(
    private store: Store<IHeader>,
    private formsService: FormsService,
    private session: CPSession,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnDestroy() {
    // Do this to un-subscribe all subscriptions on this page
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe)).subscribe((params) => {
      this.formId = Number(params['formId']);
      this.buildHeader();
      this.getItemForEdit(this.formId).subscribe((form) =>
        this.formsService.setFormBeingEdited(form)
      );
    });

    this.formsService
      .getFormBeingEdited()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((form) => (this.form = form));
  }

  private getItemForEdit(formId: number): Observable<Form> {
    if (!formId) {
      const newObj: Form = {
        name: '',
        is_confirmation_required: true,
        school_id: this.session.g.get('school').id
      };
      return of(newObj);
    }
    return this.formsService.getForm(formId, null);
  }

  buildHeader() {
    const payload = {
      heading: this.formId ? 'contact_trace_forms_edit_form' : 'contact_trace_forms_create_form',
      subheading: null,
      em: null,
      children: []
    };

    Promise.resolve().then(() => {
      this.store.dispatch({
        type: baseActions.HEADER_UPDATE,
        payload
      });
    });
  }
}
