import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Form, FormBlock, FormResponse } from '@controlpanel/contact-trace/forms/models';
import { baseActions, IHeader } from '@campus-cloud/store';
import { Store } from '@ngrx/store';
import { FormResponseService, FormsService } from '@controlpanel/contact-trace/forms/services';
import { FORMAT } from '@campus-cloud/shared/pipes';

@Component({
  selector: 'cp-forms-respondent-response',
  templateUrl: './forms-respondent-response.component.html',
  styleUrls: ['./forms-respondent-response.component.scss']
})
export class FormsRespondentResponseComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  formId: number;
  responseId: number;
  form: Form;
  response: FormResponse;
  dateFormat = FORMAT.SHORT;
  totalNumberOfQuestionsInForm = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formsService: FormsService,
    private formResponseService: FormResponseService,
    private store: Store<IHeader>
  ) {}

  ngOnDestroy() {
    // Do this to un-subscribe all subscriptions on this page
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe)).subscribe((params) => {
      this.formId = Number(params['formId']);
      this.responseId = Number(params['responseId']);
      this.formsService.getForm(this.formId, null).subscribe((form) => {
        this.form = form;
        this.buildHeader(this.form);
        this.totalNumberOfQuestionsInForm = this.calculateNumberOfQuestionsInTheForm(this.form);
      });
      this.formResponseService
        .getFormResponse(this.responseId)
        .subscribe((response) => (this.response = response));
    });
  }

  private buildHeader(form: Form) {
    this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe)).subscribe((queryParams) => {
      let caseId = Number(queryParams['caseId']);
      const payload = {
        heading: 'contact_trace_forms_form_result',
        subheading: `[NOTRANSLATE]${form.name}[NOTRANSLATE]`,
        crumbs: {
          url: caseId ? `cases/${caseId}` : `forms/edit/${form.id}/results`,
          label: 'contact_trace_forms_results'
        },
        children: []
      };

      this.store.dispatch({
        type: baseActions.HEADER_UPDATE,
        payload
      });
    });
  }

  private calculateNumberOfQuestionsInTheForm(form: Form): number {
    let questionBlocks: FormBlock[] = [];

    if (form && form.form_block_list) {
      questionBlocks = form.form_block_list.filter(
        (formBlock, index) => index > 0 && !formBlock.is_terminal
      );
    }

    return questionBlocks.length;
  }
}
