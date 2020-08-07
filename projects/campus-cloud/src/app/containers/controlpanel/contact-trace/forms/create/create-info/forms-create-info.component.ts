import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsService } from '../../services';
import { filter, takeUntil } from 'rxjs/operators';
import { BlockType, Form, FormStatus } from '../../models';
import { Observable, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FormsHelperService } from '@controlpanel/contact-trace/forms/services/forms-helper.service';
import { baseActionClass, baseActions, IHeader } from '@campus-cloud/store';
import { Store } from '@ngrx/store';
import { HttpParams } from '@angular/common/http';
import { CPSession } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-forms-create-info',
  templateUrl: './forms-create-info.component.html',
  styleUrls: ['./forms-create-info.component.scss']
})
export class FormsCreateInfoComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  form: Form;
  templateForms: Form[];
  formStatus = FormStatus;

  constructor(
    private formsService: FormsService,
    private router: Router,
    private store: Store<IHeader>,
    private session: CPSession,
    private cpI18n: CPI18nService
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
      });

    this.formsService
      .getTemplateForms()
      .subscribe((templateForms) => (this.templateForms = templateForms));
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

  nextClickHandler(): void {
    if (this.form.form_block_list) {
      this.navigateToBuilderPage();
    } else {
      this.getTemplateForm(this.form.template_form_id).subscribe((templateForm) => {
        if (!templateForm) {
          this.form.form_block_list = [
            {
              block_type: BlockType.no_input,
              is_required: false,
              block_content_list: [
                {
                  rank: 0,
                  text: ''
                }
              ]
            }
          ];
        } else {
          FormsHelperService.formatFormCreatedFromTemplate(this.form, templateForm);
        }
        this.navigateToBuilderPage();
      });
    }
  }

  saveClickHandler(): void {
    const formCopyForSave: Form = {
      id: this.form.id,
      name: this.form.name
    };
    const params = new HttpParams().set('school_id', this.session.g.get('school').id);
    this.formsService.updateForm(formCopyForSave, params).subscribe((form) => {
      FormsHelperService.formatFormFromDatabaseForUI(form);
      this.formsService.setFormBeingEdited(form);
      this.handleSuccess('contact_trace_forms_save_successful');
    });
  }

  private handleSuccess(key) {
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: this.cpI18n.translate(key)
      })
    );
  }

  private navigateToBuilderPage(): void {
    this.router.navigate(['/contact-trace/forms/edit', this.form.id ? this.form.id : 0, 'builder']);
  }

  private getTemplateForm(templateFormId: number): Observable<Form> {
    if (!templateFormId) {
      return of(null);
    }
    return this.formsService.getForm(templateFormId, null);
  }
}
