import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Form, FormStatus } from '../../models';
import { Router } from '@angular/router';
import { canSchoolWriteResource } from '@campus-cloud/shared/utils';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { CPSession } from '@campus-cloud/session';
import { FormsService } from '../../services';
import { baseActionClass, ISnackbar } from '@campus-cloud/store';
import { Store } from '@ngrx/store';
import { ILocationsState } from '@controlpanel/manage/locations/store';
import { CPI18nService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-form-search-result-tile',
  templateUrl: './form-search-result-tile.component.html',
  styleUrls: ['./form-search-result-tile.component.scss']
})
export class FormSearchResultTileComponent implements OnInit {
  @Input() form: Form;
  @Output() itemUpdated = new EventEmitter<Form>();
  @Output() itemDuplicated = new EventEmitter<any>();

  canEdit: boolean;
  showFormDeleteModal: boolean;
  showFormPublishModal: boolean;
  showFormUnpublishModal: boolean;
  showFormDuplicateModal: boolean;
  completionPercentStr: string;
  resultLabels: string[];
  formStatus = FormStatus;

  constructor(
    private router: Router,
    private session: CPSession,
    private formsService: FormsService,
    private cpI18n: CPI18nService,
    private store: Store<ILocationsState | ISnackbar>
  ) {}

  ngOnInit(): void {
    this.canEdit = canSchoolWriteResource(this.session.g, CP_PRIVILEGES_MAP.contact_trace_forms);
    this.calculateCompletionPercent();
    if (this.form && this.form.daily_stats && this.form.daily_stats.terminal_blocks) {
      this.resultLabels = Object.keys(this.form.daily_stats.terminal_blocks);
    }
  }

  editClickHandler(): void {
    this.router.navigate(['/contact-trace/forms/edit', this.form.id, 'info']);
  }

  shareClickHandler(): void {
    this.router.navigate(['/contact-trace/forms/edit', this.form.id, 'share']);
  }

  resultsClickHandler(): void {
    this.router.navigate(['/contact-trace/forms/edit', this.form.id, 'results']);
  }

  publishClickHandler(): void {
    this.showFormPublishModal = true;
  }

  duplicateClickHandler(): void {
    this.showFormDuplicateModal = true;
  }

  unpublishClickHandler(): void {
    this.showFormUnpublishModal = true;
  }

  deleteClickHandler(): void {
    this.showFormDeleteModal = true;
  }

  onDeletedForm(): void {
    this.handleSuccess('contact_trace_forms_form_delete_success');
    this.itemUpdated.emit();
  }

  onPublishedForm(): void {
    this.handleSuccess('contact_trace_forms_publish_successful');
    this.itemUpdated.emit();
  }

  onUnpublishedForm(): void {
    this.handleSuccess('contact_trace_forms_form_unpublish_success');
    this.itemUpdated.emit();
  }

  onDuplicateForm(duplicatedForm: any) {
    this.itemDuplicated.emit(duplicatedForm);
  }

  private handleSuccess(key) {
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: this.cpI18n.translate(key)
      })
    );
  }

  private calculateCompletionPercent(): void {
    let completionPercent = '';
    if (this.form && this.form.daily_stats) {
      if (this.form.daily_stats.unique_views) {
        // Denominator cannot be null;
        const views: number = this.form.daily_stats.unique_views;
        const submissions: number = this.form.daily_stats.unique_submissions
          ? this.form.daily_stats.unique_submissions
          : 0;
        completionPercent = `${submissions} (${Math.round((submissions / views) * 100)}%)`;
      }
    }
    this.completionPercentStr = completionPercent;
  }

  duplicationFormCloseHandler() {
    this.showFormDuplicateModal = false;
  }
}
