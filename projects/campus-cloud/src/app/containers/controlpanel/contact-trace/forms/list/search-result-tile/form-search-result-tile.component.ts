import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Form } from '@controlpanel/contact-trace/forms/models';
import { Router } from '@angular/router';
import { canSchoolWriteResource } from '@campus-cloud/shared/utils';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { CPSession } from '@campus-cloud/session';
import { HttpParams } from '@angular/common/http';
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
  canEdit: boolean;
  showFormDeleteModal: boolean;
  showFormUnpublishModal: boolean;

  constructor(
    private router: Router,
    private session: CPSession,
    private formsService: FormsService,
    private cpI18n: CPI18nService,
    private store: Store<ILocationsState | ISnackbar>
  ) {}

  ngOnInit(): void {
    this.canEdit = canSchoolWriteResource(this.session.g, CP_PRIVILEGES_MAP.contact_trace_forms);
  }

  editClickHandler(): void {
    this.router.navigate(['/contact-trace/forms/edit', this.form.id, 'info']);
  }

  shareClickHandler(): void {
    this.router.navigate(['/contact-trace/forms/share', this.form.id]);
  }

  resultsClickHandler(): void {
    this.router.navigate(['/contact-trace/forms/results', this.form.id]);
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

  onUnpublishedForm(): void {
    this.handleSuccess('contact_trace_forms_form_unpublish_success');
    this.itemUpdated.emit();
  }

  private handleSuccess(key) {
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: this.cpI18n.translate(key)
      })
    );
  }
}
