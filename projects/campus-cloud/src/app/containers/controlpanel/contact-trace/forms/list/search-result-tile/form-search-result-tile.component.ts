import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Form } from '@controlpanel/contact-trace/forms/models';
import { Router } from '@angular/router';
import { canSchoolWriteResource } from '@campus-cloud/shared/utils';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { CPSession } from '@campus-cloud/session';
import { HttpParams } from '@angular/common/http';
import { FormsService } from '../../services';

@Component({
  selector: 'cp-form-search-result-tile',
  templateUrl: './form-search-result-tile.component.html',
  styleUrls: ['./form-search-result-tile.component.scss']
})
export class FormSearchResultTileComponent implements OnInit {
  @Input() form: Form;
  @Output() itemUpdated = new EventEmitter<Form>();
  canEdit: boolean;

  constructor(
    private router: Router,
    private session: CPSession,
    private formsService: FormsService
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

  unPublishClickHandler(): void {
    this.formsService.getForm(this.form.id, null).subscribe((formFromDb) => {
      const formCopy: Form = { ...formFromDb, is_published: false };
      const params = new HttpParams().set('school_id', this.session.g.get('school').id);
      this.formsService.updateForm(formCopy, params).subscribe((form) => {
        this.itemUpdated.emit(form);
      });
    });
  }
}
