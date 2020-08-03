import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { baseActions, IHeader } from '@campus-cloud/store';
import { ActivatedRoute } from '@angular/router';
import { FormsService } from '@controlpanel/contact-trace/forms/services';
import { takeUntil } from 'rxjs/operators';
import { Form } from '@controlpanel/contact-trace/forms/models';

@Component({
  selector: 'cp-forms-create-results',
  templateUrl: './forms-create-results.component.html',
  styleUrls: ['./forms-create-results.component.scss']
})
export class FormsCreateResultsComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    public store: Store<IHeader>,
    private activatedRoute: ActivatedRoute,
    private formsService: FormsService
  ) {}

  ngOnDestroy() {
    // Do this to un-subscribe all subscriptions on this page
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe)).subscribe((params) => {
      const formId = Number(params['formId']);
      return this.formsService.getForm(formId, null).subscribe((form) => {
        this.buildHeader(form);
      });
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
