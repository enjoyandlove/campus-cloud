import { Component, OnDestroy, OnInit } from '@angular/core';
import { baseActionClass, baseActions, IHeader } from '@campus-cloud/store';
import { Store } from '@ngrx/store';
import { filter, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { FormsHelperService, FormsService } from '../../services';
import { LayoutWidth } from '@campus-cloud/layouts/interfaces';
import { canSchoolWriteResource } from '@campus-cloud/shared/utils';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { CPSession } from '@campus-cloud/session';
import { HttpParams } from '@angular/common/http';
import { CPI18nService } from '@campus-cloud/shared/services';
import { Form } from '../../models';

@Component({
  selector: 'cp-forms-create-share',
  templateUrl: './forms-create-share.component.html',
  styleUrls: ['./forms-create-share.component.scss']
})
export class FormsCreateShareComponent implements OnInit, OnDestroy {
  layoutWidth = LayoutWidth.third;
  private unsubscribe: Subject<void> = new Subject();
  form: Form;
  canEdit: boolean;
  url: string;

  constructor(
    public store: Store<IHeader>,
    private formsService: FormsService,
    private router: Router,
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
        this.url = FormsHelperService.generateShareUrl(form);
        setTimeout(() => this.buildHeader(form));
      });

    this.canEdit = canSchoolWriteResource(this.session.g, CP_PRIVILEGES_MAP.contact_trace_forms);
  }

  public buildHeader(form: Form) {
    const payload = {
      heading: 'contact_trace_forms_share',
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

  gotoStudioClickHandler(): void {
    this.router.navigate(['/studio/experiences']);
  }

  reminderToggleHandler(): void {
    this.form.daily_reminder_enabled = !this.form.daily_reminder_enabled;
    const formCopyForSave: Form = {
      id: this.form.id,
      daily_reminder_enabled: this.form.daily_reminder_enabled
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

  notifyCopySuccess() {
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: this.cpI18n.translate('contact_trace_forms_copied_clipboard')
      })
    );
  }
}
