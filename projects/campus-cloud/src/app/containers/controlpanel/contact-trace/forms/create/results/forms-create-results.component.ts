import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { baseActions, IHeader } from '@campus-cloud/store';
import { FormResponseService, FormsHelperService, FormsService } from '../../services';
import { filter, finalize, map, takeUntil } from 'rxjs/operators';
import { Form, FormBlock, FormResponse, FormResultExport } from '@controlpanel/contact-trace/forms/models';
import { IItem } from '@campus-cloud/shared/components';
import { Router } from '@angular/router';
import { CPDatePipe, CPI18nPipe, FORMAT } from '@campus-cloud/shared/pipes';
import { CollectionMethodCodeToDisplayStringPipe } from '@controlpanel/contact-trace/forms/pipes';
import { FormResponseExportService } from '@controlpanel/contact-trace/forms/services/form-response-export.service';

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
  formResultExport: FormResultExport[];

  constructor(
    public store: Store<IHeader>,
    private formsService: FormsService,
    private formResponseService: FormResponseService,
    private cpI18n: CPI18nPipe,
    private collectionMethodPipe: CollectionMethodCodeToDisplayStringPipe,
    private router: Router,
    private cPDatePipe: CPDatePipe,
    private formResponseExportService: FormResponseExportService
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
        label: this.cpI18n.transform('contact_trace_forms_all_questions'),
        action: null
      }
    ];
    this.resultOptions = [
      {
        label: this.cpI18n.transform('contact_trace_forms_all_responses'),
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
    const startRecordCount = this.paginationCountPerPage * (this.pageCounter - 1) + 1;
    // Get an extra record so that we know if there are more records left to fetch
    const endRecordCount = this.paginationCountPerPage * this.pageCounter + 1;
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

  onExportData() {
    this.formResultExport = [];
    this.formResponseService
      .getFullFormResponse(this.form.id, this.filterQuestionBlockId, this.filterResultBlockId)
      .pipe(filter((formResponses: FormResponse[]) => formResponses.length > 0))
      .subscribe((formResponses: FormResponse[]) => {
        formResponses.forEach((formResponse) => {
          for (let i = 1; i < this.form.form_block_list.length; i++) {
            const formBloc = this.form.form_block_list[i];
            if (formBloc.is_terminal || (this.filterQuestionBlockId && this.filterQuestionBlockId !== formBloc.id)) {
              continue;
            }
            const formResultExportItem: FormResultExport = this.initFormResultExportItem(formResponse);
            formResultExportItem.question = formBloc.text;
            formResultExportItem.answer = FormsHelperService.generateRespondentResponsesForQuestion(
              formResponse,
              formBloc
            ).join('\n');

            this.formResultExport.push(formResultExportItem);
          }
        });
        const fileName = this.form.name + '_Result-Export_' + this.cPDatePipe.transform(new Date().getDate(), FORMAT.DATETIME);
        const includeInternalUserFields = !!formResponses.find((response: FormResponse) => response.user_id > 0);
        this.formResponseExportService.exportFormResponsesAsCsv(this.formResultExport, includeInternalUserFields, fileName);
      });
  }

  private initFormResultExportItem(formResponse: FormResponse): FormResultExport {
    return {
      fistname: formResponse.firstname,
      lastname: formResponse.lastname,
      extern_user_id: formResponse.user_id > 0 ? formResponse.email : formResponse.extern_user_id,
      completionDate: this.cPDatePipe.transform(formResponse.response_completed_epoch, FORMAT.DATETIME),
      collectionMethod: this.cpI18n.transform(this.collectionMethodPipe.transform(formResponse.collection_method)),
      result: this.blockIdToBlockMap[formResponse.terminal_form_block_id].name,
      question: '',
      answer: ''
    };
  }
}
