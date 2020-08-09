import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { baseActions, IHeader } from '@campus-cloud/store';
import { FormResponseService, FormsService } from '../../services';
import { filter, finalize, map, takeUntil } from 'rxjs/operators';
import { Form, FormBlock, FormResponse } from '../../models';
import { IItem } from '@campus-cloud/shared/components';
import { CPI18nService } from '@campus-cloud/shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'cp-forms-create-results',
  templateUrl: './forms-create-results.component.html',
  styleUrls: ['./forms-create-results.component.scss']
})
export class FormsCreateResultsComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  form: Form;
  questionOptions: IItem[] = [];
  resultOptions: IItem[] = [];
  blockIdToBlockMap: { [key: string]: FormBlock } = {};
  responses: FormResponse[] = [];
  filterQuestionBlockId: number;
  filterResultBlockId: number;
  hasMorePages = false;
  pageCounter = 1;
  paginationCountPerPage = 25;
  webServiceCallInProgress: boolean;

  constructor(
    public store: Store<IHeader>,
    private formsService: FormsService,
    private formResponseService: FormResponseService,
    private cpI18n: CPI18nService,
    private router: Router
  ) {}

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
        this.prepareSelectionOptions();
        this.refreshDataOnScreen();
      });
  }

  private prepareSelectionOptions(): void {
    this.blockIdToBlockMap = {};
    this.questionOptions = [
      {
        label: this.cpI18n.translate('contact_trace_forms_all_questions'),
        action: null
      }
    ];
    this.resultOptions = [
      {
        label: this.cpI18n.translate('contact_trace_forms_all_responses'),
        action: null
      }
    ];
    if (this.form && this.form.form_block_list) {
      this.form.form_block_list.forEach((formBlock, index) => {
        this.blockIdToBlockMap[formBlock.id] = formBlock;
        if (index > 0) {
          // skip Welcome Block
          if (!formBlock.is_terminal) {
            // Identify Question blocks
            this.questionOptions.push({
              label: `${index}. ${formBlock.text}`,
              action: formBlock.id
            });
          } else {
            // Identify Result blocks
            this.resultOptions.push({
              label: formBlock.name,
              action: formBlock.id
            });
          }
        }
      });
    }
  }

  private refreshDataOnScreen(): void {
    let startRecordCount = this.paginationCountPerPage * (this.pageCounter - 1) + 1;
    // Get an extra record so that we know if there are more records left to fetch
    let endRecordCount = this.paginationCountPerPage * this.pageCounter + 1;
    this.webServiceCallInProgress = true;
    this.formResponseService
      .getFormResponseWithFilter(
        this.form.id,
        this.filterQuestionBlockId,
        this.filterResultBlockId,
        startRecordCount,
        endRecordCount
      )
      .pipe(
        map((results: FormResponse[]) => {
          if (results.length > this.paginationCountPerPage) {
            this.hasMorePages = true;
            results.splice(results.length - 1, 1);
          } else {
            this.hasMorePages = false;
          }
          return results;
        }),
        finalize(() => (this.webServiceCallInProgress = false))
      )
      .subscribe((responses: any[]) => (this.responses = responses));
  }

  private buildHeader(form: Form) {
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

  onSelectedQuestion({ action: formBlockId }: IItem | any): void {
    this.filterQuestionBlockId = formBlockId;
    this.hasMorePages = false;
    this.pageCounter = 1;
    this.refreshDataOnScreen();
  }

  onSelectedResult({ action: formBlockId }: IItem | any): void {
    this.filterResultBlockId = formBlockId;
    this.hasMorePages = false;
    this.pageCounter = 1;
    this.refreshDataOnScreen();
  }

  onPaginationNext() {
    this.pageCounter++;
    this.refreshDataOnScreen();
  }

  onPaginationPrevious() {
    this.pageCounter--;
    this.refreshDataOnScreen();
  }

  responseTileClickHandler(formId: number, responseId: number): void {
    this.router.navigate(['/contact-trace/forms', formId, 'response', responseId]);
  }
}
