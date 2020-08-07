import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsService } from '../services';
import { Form, FormStatus } from '../models';
import { CPSession } from '@campus-cloud/session';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-forms-create',
  templateUrl: './forms-create.component.html',
  styleUrls: ['./forms-create.component.scss']
})
export class FormsCreateComponent implements OnInit {
  private unsubscribe: Subject<void> = new Subject();
  form: Form;
  formId: number;
  formStatus = FormStatus;

  constructor(
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
        is_confirmation_required: true,
        school_id: this.session.g.get('school').id,
        status: FormStatus.draft
      };
      return of(newObj);
    }
    return this.formsService.getForm(formId, null);
  }
}
