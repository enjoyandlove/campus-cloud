import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { baseActions, IHeader } from '@campus-cloud/store';
import { FormsService } from '@controlpanel/contact-trace/forms/services';
import { filter, takeUntil } from 'rxjs/operators';
import { Form } from '../../models';

@Component({
  selector: 'cp-forms-create-results',
  templateUrl: './forms-create-results.component.html',
  styleUrls: ['./forms-create-results.component.scss']
})
export class FormsCreateResultsComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  form: Form;

  constructor(public store: Store<IHeader>, private formsService: FormsService) {}

  ngOnDestroy() {
    // Do this to un-subscribe all subscriptions on this page
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.formsService
      .getFormBeingEdited()
      .pipe(
        takeUntil(this.unsubscribe),
        filter((form, i) => !!form)
      )
      .subscribe((form) => {
        this.form = form;
        setTimeout(() => this.buildHeader(form));
      });
  }

  public buildHeader(form: Form) {
    const payload = {
      heading: 'contact_trace_forms_results',
      subheading: `[NOTRANSLATE]${form.name}[NOTRANSLATE]`,
      crumbs: {
        url: 'forms',
        label: 'admin_contact_trace_forms'
      },
      children: []
    };

    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload
    });
  }
}
