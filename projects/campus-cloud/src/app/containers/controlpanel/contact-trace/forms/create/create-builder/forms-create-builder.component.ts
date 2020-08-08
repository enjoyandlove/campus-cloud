import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, finalize, takeUntil } from 'rxjs/operators';
import { BlockType, Form, FormBlock } from '../../models';
import { FormsService } from '../../services';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { CPSession } from '@campus-cloud/session';
import { FormsHelperService } from '@controlpanel/contact-trace/forms/services/forms-helper.service';
import { baseActionClass, baseActions } from '@campus-cloud/store';
import { CPI18nService } from '@campus-cloud/shared/services';
import { Store } from '@ngrx/store';

@Component({
  selector: 'cp-forms-create-builder',
  templateUrl: './forms-create-builder.component.html',
  styleUrls: ['./forms-create-builder.component.scss']
})
export class FormsCreateBuilderComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  form: Form;
  welcomeBlock: FormBlock;
  questionBlocks: FormBlock[];
  resultBlocks: FormBlock[];
  highlightFormError: boolean;
  highlightFormErrorForPublish: boolean;
  showFormPublishModal: boolean;
  webServiceCallInProgress: boolean;

  constructor(
    private formsService: FormsService,
    private router: Router,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private store: Store<any>
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
        this.buildHeader();
        if (!this.form.name) {
          this.router.navigate(['/contact-trace/forms']);
        } else {
          this.initializeScreenFields();
        }
      });
  }

  private buildHeader() {
    const payload = {
      heading: this.form.id ? 'contact_trace_forms_edit_form' : 'contact_trace_forms_create_form',
      subheading: `[NOTRANSLATE]${this.form.name}[NOTRANSLATE]`,
      em: null,
      crumbs: {
        url: 'forms',
        label: 'admin_contact_trace_forms'
      },
      children: []
    };

    Promise.resolve().then(() => {
      this.store.dispatch({
        type: baseActions.HEADER_UPDATE,
        payload
      });
    });
  }

  private initializeScreenFields(): void {
    this.welcomeBlock = null;
    this.questionBlocks = null;
    this.resultBlocks = null;
    if (this.form && this.form.form_block_list) {
      if (this.form && this.form.form_block_list && this.form.form_block_list.length > 0) {
        this.welcomeBlock = this.form.form_block_list[0];
      }
      this.questionBlocks = this.form.form_block_list.filter(
        (formBlock, index) => index > 0 && !formBlock.is_terminal
      );
      this.resultBlocks = this.form.form_block_list.filter((formBlock) => formBlock.is_terminal);
    }
  }

  addQuestionClickHandler(index: number): void {
    this.questionBlocks.splice(index, 0, { is_required: true });
    this.updateBlocksListOnFormObject();
    this.updateSkipToForInserts(1 + index); // Add one for Welcome block
  }

  addResultClickHandler(index: number): void {
    this.resultBlocks.splice(index, 0, {
      block_type: BlockType.no_input,
      is_terminal: true,
      is_required: false,
      block_content_list: [
        {
          rank: 0,
          text: ''
        }
      ]
    });
    this.updateBlocksListOnFormObject();
    this.updateSkipToForInserts(1 + (this.questionBlocks ? this.questionBlocks.length : 0) + index); // Add one for Welcome block
  }

  deleteQuestionClickHandler(index: number): void {
    this.questionBlocks.splice(index, 1);
    this.updateBlocksListOnFormObject();
    this.updateSkipToForDeletes(1 + index); // Add one for Welcome block
  }

  deleteResultClickHandler(index: number): void {
    this.resultBlocks.splice(index, 1);
    this.updateBlocksListOnFormObject();
    this.updateSkipToForDeletes(1 + (this.questionBlocks ? this.questionBlocks.length : 0) + index); // Add one for Welcome block
  }

  publishClickHandler(): void {
    this.highlightFormError = false;
    this.highlightFormErrorForPublish = false;
    const errorMessages: string[] = FormsHelperService.validateBeforeSave(this.form, true);
    if (errorMessages && errorMessages.length > 0) {
      this.showWarning();
      this.highlightFormError = true;
      this.highlightFormErrorForPublish = true;
    } else {
      this.showFormPublishModal = true;
      setTimeout(() => $('#formPublishModal').modal('show'));
    }
  }

  saveAsDraftClickHandler(): void {
    this.highlightFormError = false;
    this.highlightFormErrorForPublish = false;
    const errorMessages: string[] = FormsHelperService.validateBeforeSave(this.form, false);
    if (errorMessages && errorMessages.length > 0) {
      this.showWarning();
      this.highlightFormError = true;
    } else {
      this.webServiceCallInProgress = true;
      const params = new HttpParams().set('school_id', this.session.g.get('school').id);
      if (!this.form.id) {
        this.formsService
          .createForm(this.form, params)
          .pipe(finalize(() => (this.webServiceCallInProgress = false)))
          .subscribe((form) => this.handleFormSaveAsDraftSuccess(form));
      } else {
        this.formsService
          .updateForm(this.form, params)
          .pipe(finalize(() => (this.webServiceCallInProgress = false)))
          .subscribe((form) => this.handleFormSaveAsDraftSuccess(form));
      }
    }
  }

  onPublishedForm(form: Form): void {
    this.handleSuccess('contact_trace_forms_publish_successful');
    FormsHelperService.formatFormFromDatabaseForUI(form);
    this.formsService.setFormBeingEdited(form);
    this.router.navigate(['/contact-trace/forms/edit', form.id, 'share']);
  }

  private handleFormSaveAsDraftSuccess(form: Form): void {
    this.handleSuccess('contact_trace_forms_save_draft_successful');
    FormsHelperService.formatFormFromDatabaseForUI(form);
    this.formsService.setFormBeingEdited(form);
    // This routing is needed when a form is being created for the first time.
    // In that case, the formId in the url needs to be updated to the newly created formId.
    this.router.navigate(['/contact-trace/forms/edit', form.id, 'builder']);
  }

  private handleSuccess(key) {
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: this.cpI18n.translate(key)
      })
    );
  }

  private showWarning() {
    const options = {
      class: 'warning',
      body: this.cpI18n.translate('error_fill_out_marked_fields')
    };

    this.dispatchSnackBar(options);
  }

  private dispatchSnackBar(options) {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        ...options,
        sticky: true,
        autoClose: true
      }
    });
  }

  private updateBlocksListOnFormObject(): void {
    this.form.form_block_list = [this.welcomeBlock, ...this.questionBlocks, ...this.resultBlocks];
  }

  private updateSkipToForInserts(index: number): void {
    this.form.form_block_list.forEach((formBlock) => {
      if (
        formBlock &&
        formBlock.block_logic_list &&
        formBlock.block_logic_list.length > 0 &&
        formBlock.block_logic_list[0].next_block_index >= index
      ) {
        formBlock.block_logic_list.forEach(
          (blockLogic) => (blockLogic.next_block_index = blockLogic.next_block_index + 1)
        );
      }
    });
  }

  private updateSkipToForDeletes(index: number): void {
    this.form.form_block_list.forEach((formBlock) => {
      if (
        formBlock &&
        formBlock.block_logic_list &&
        formBlock.block_logic_list.length > 0 &&
        formBlock.block_logic_list[0].next_block_index !== -1
      ) {
        if (formBlock.block_logic_list[0].next_block_index === index) {
          formBlock.block_logic_list.forEach((blockLogic) => (blockLogic.next_block_index = -1));
        }
        if (formBlock.block_logic_list[0].next_block_index > index) {
          formBlock.block_logic_list.forEach(
            (blockLogic) => (blockLogic.next_block_index = blockLogic.next_block_index - 1)
          );
        }
      }
    });
  }
}
