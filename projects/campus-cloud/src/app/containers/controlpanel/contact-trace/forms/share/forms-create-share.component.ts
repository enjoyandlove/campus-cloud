import { Component, OnDestroy, OnInit } from '@angular/core';
import { baseActionClass, baseActions, IHeader } from '@campus-cloud/store';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { FormsService } from '@controlpanel/contact-trace/forms/services';
import { Form } from '../models';
import { LayoutWidth } from '@campus-cloud/layouts/interfaces';
import { canSchoolWriteResource } from '@campus-cloud/shared/utils';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { CPSession } from '@campus-cloud/session';
import { HttpParams } from '@angular/common/http';
import { CPI18nService } from '@campus-cloud/shared/services';

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
    private activatedRoute: ActivatedRoute,
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
    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe)).subscribe((params) => {
      const formId = Number(params['formId']);
      return this.formsService.getForm(formId, null).subscribe((form) => {
        this.form = form;
        // ToDo: PJ: Add logic to generate the URL
        this.url = ' ';
        this.buildHeader(form);
      });
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
    const params = new HttpParams().set('school_id', this.session.g.get('school').id);
    this.formsService.updateForm(this.form, params).subscribe();
  }

  notifyCopySuccess() {
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: this.cpI18n.translate('contact_trace_forms_copied_clipboard')
      })
    );
  }
}
