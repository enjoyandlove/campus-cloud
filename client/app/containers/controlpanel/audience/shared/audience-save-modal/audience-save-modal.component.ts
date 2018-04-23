import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { CPI18nService } from './../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-audience-save-modal',
  templateUrl: './audience-save-modal.component.html',
  styleUrls: ['./audience-save-modal.component.scss']
})
export class AudienceSaveModalComponent implements OnInit {
  buttonData;
  form: FormGroup;

  constructor(public fb: FormBuilder, public cpI18n: CPI18nService) {}

  resetModal() {
    this.form.reset();
  }

  doSubmit() {
    // console.log(this.form.value);
  }

  ngOnInit(): void {
    this.buttonData = {
      class: 'primary',
      disabled: true,
      text: this.cpI18n.translate('save')
    };

    this.form = this.fb.group({
      name: [null, Validators.required]
    });

    this.form.valueChanges.subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.form.valid };
    });
  }
}
