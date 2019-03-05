import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

import { MODAL_DATA, IModal } from '@shared/services';
import { CustomTextValidators } from '@shared/validators';

@Component({
  selector: 'cp-testers-create',
  templateUrl: './testers-create.component.html',
  styleUrls: ['./testers-create.component.scss']
})
export class TestersCreateComponent implements OnInit {
  form: FormGroup;

  constructor(@Inject(MODAL_DATA) public modal: IModal) {}

  doCreate() {
    const value = this.form.get('emails').value;
    const emails = value
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email.length);
    this.modal.onAction(emails);
    this.modal.onClose();
  }

  doCancel() {
    this.modal.onClose();
  }

  ngOnInit() {
    this.form = new FormBuilder().group({
      emails: [null, CustomTextValidators.commaSeparated(Validators.email)]
    });
  }
}
