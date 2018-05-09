import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CPI18nService } from '../../../../../../shared/services';

@Component({
  selector: 'cp-employer-card',
  templateUrl: './employer-card.component.html',
  styleUrls: ['./employer-card.component.scss']
})

export class EmployerCardComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() employerForm: FormGroup;

  @Output() isNewEmployer: EventEmitter<boolean> = new EventEmitter();
  @Output() formData: EventEmitter<{
    job: any;
    jobFormValid: boolean
    employer: any;
    employerFormValid: boolean
  }> = new EventEmitter();

  newEmployerTitle;
  existingEmployerTitle;

  constructor(
    public cpI18n: CPI18nService
  ) {}

  onTabClick({ id }) {
    if (id === 'existing') {
      this.setRequiredField(false);
      this.isStoreRequired(true);
      this.isNewEmployer.emit(false);
    }

    if (id === 'new') {
      this.setRequiredField(true);
      this.isStoreRequired(false);
      this.isNewEmployer.emit(true);
    }
  }

  isStoreRequired(value) {
    const store_id = this.form.controls['store_id'].value;
    this.form.setControl('store_id', new FormControl(store_id, value ? Validators.required : null));
  }

  setRequiredField(value) {
    const name = this.employerForm.controls['name'].value;
    const logo = this.employerForm.controls['logo_url'].value;
    this.employerForm.setControl('name', new FormControl(name, value ? Validators.required : null));

    this.employerForm.setControl(
      'logo_url',
      new FormControl(logo, value ? Validators.required : null)
    );
  }

  ngOnInit() {
    this.newEmployerTitle = this.cpI18n.translate('jobs_new_employer');
    this.existingEmployerTitle = this.cpI18n.translate('jobs_existing_employer');

    this.employerForm.valueChanges.subscribe(() => {
      this.formData.emit({
        job: this.form.value,
        jobFormValid: this.form.valid,
        employer: this.employerForm.value,
        employerFormValid: this.employerForm.valid,
      });
    });
  }
}
