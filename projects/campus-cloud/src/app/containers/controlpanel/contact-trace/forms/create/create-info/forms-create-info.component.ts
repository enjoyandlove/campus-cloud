import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsService } from '../../services';
import { filter, takeUntil } from 'rxjs/operators';
import { BlockType, Form } from '../../models';
import { Observable, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FormsHelperService } from '@controlpanel/contact-trace/forms/services/forms-helper.service';

@Component({
  selector: 'cp-forms-create-info',
  templateUrl: './forms-create-info.component.html',
  styleUrls: ['./forms-create-info.component.scss']
})
export class FormsCreateInfoComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  form: Form;
  templateForms: Form[];

  constructor(private formsService: FormsService, private router: Router) {}

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
      .subscribe((form) => (this.form = form));

    this.formsService
      .getTemplateForms()
      .subscribe((templateForms) => (this.templateForms = templateForms));
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
              name: 'welcome',
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
