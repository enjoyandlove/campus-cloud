import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CPSession } from './../../../../../../../../session';
import { EventUtilService } from '../../../../events.utils.service';
import { CPI18nService } from '../../../../../../../../shared/services';

@Component({
  selector: 'cp-event-attendance-add-check-in',
  templateUrl: './add-check-in.component.html',
  styleUrls: ['./add-check-in.component.scss']
})
export class AddCheckInComponent implements OnInit {
  @Input() event: any;

  buttonData;
  form: FormGroup;
  formErrors = false;

  constructor(
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public utils: EventUtilService) {}

  doReset() {
    this.form.reset();
    this.formErrors = false;
  }

  onSubmit() {
    this.formErrors = true;
    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  ngOnInit() {
    this.form = this.fb.group({
      check_out_time: [null],
      email: [null, Validators.required],
      last_name: [null, Validators.required],
      first_name: [null, Validators.required],
      check_in_time: [null, Validators.required]
    });

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('save')
    };
  }
}
