/*tslint:disable:max-line-length*/
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { CPSession } from '../../../../../../session';
import { CPDate } from '../../../../../../shared/utils';
import { BaseComponent } from '../../../../../../base';
import { JobsUtilsService } from '../../jobs.utils.service';
import { CPI18nService } from '../../../../../../shared/services';

const COMMON_DATE_PICKER_OPTIONS = {
  utc: true,
  altInput: true,
  enableTime: true,
  altFormat: 'F j, Y h:i K'
};

@Component({
  selector: 'cp-jobs-form',
  templateUrl: './jobs-form.component.html',
  styleUrls: ['./jobs-form.component.scss']
})
export class JobsFormComponent extends BaseComponent implements OnInit {
  @Input() form: FormGroup;

  @Output() isStoreRequired: EventEmitter<boolean> = new EventEmitter();
  @Output()
  submitted: EventEmitter<{
    job: any;
    employer: any;
    isNewEmployer: boolean;
  }> = new EventEmitter();

  jobsType;
  buttonData;
  employers$;
  isDateError;
  desiredStudy;
  selectedEmployer;
  newEmployerTitle;
  existingEmployerTitle;
  dateErrorMessage;
  formError = false;
  newEmployer = false;
  employerForm: FormGroup;
  postingStartDatePickerOptions;
  postingEndDatePickerOptions;
  contractStartDatePickerOptions;
  applicationDeadlineDatePickerOptions;

  constructor(
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public utils: JobsUtilsService
  ) {
    super();
  }

  onSelectedEmployer(store_id) {
    this.form.controls['store_id'].setValue(store_id);
  }

  onJobTypeDesiredStudyToggle(name, value) {
    this.form.controls[name].setValue(value);
  }

  enableButton() {
    this.buttonData = { ...this.buttonData, disabled: false };
  }

  onTabClick({ id }) {
    if (id === 'existing') {
      this.newEmployer = false;
      this.setIsNameRequired(false);
      this.isStoreRequired.emit(true);
    }

    if (id === 'new') {
      this.newEmployer = true;
      this.setIsNameRequired(true);
      this.isStoreRequired.emit(false);
    }
  }

  setIsNameRequired(value) {
    this.employerForm.setControl('name', new FormControl(null, value ? Validators.required : null));

    this.employerForm.setControl(
      'logo_url',
      new FormControl(null, value ? Validators.required : null)
    );
  }

  buildEmployerForm() {
    this.employerForm = this.fb.group({
      name: [null],
      description: [null],
      email: [null],
      logo_url: [null]
    });
  }

  onSubmit() {
    this.formError = false;

    if (!this.form.valid || !this.employerForm.valid) {
      this.formError = true;
      this.enableButton();

      return;
    }

    if (this.form.controls['posting_end'].value <= this.form.controls['posting_start'].value) {
      this.enableButton();
      this.isDateError = true;
      this.formError = true;
      this.form.controls['posting_end'].setErrors({ required: true });
      this.dateErrorMessage = this.cpI18n.translate('jobs_error_end_date_before_start');

      return;
    }

    if (this.form.controls['posting_end'].value <= Math.round(CPDate.now().unix())) {
      this.enableButton();
      this.isDateError = true;
      this.formError = true;
      this.form.controls['posting_end'].setErrors({ required: true });
      this.dateErrorMessage = this.cpI18n.translate('jobs_error_end_date_after_now');

      return;
    }

    this.submitted.emit({
      job: this.form.value,
      employer: this.employerForm.value,
      isNewEmployer: this.newEmployer
    });
  }

  _selectedEmployer() {
    const store_id = this.form.controls['store_id'].value;
    if (store_id) {
      super.fetchData(this.employers$).then((employer) => {
        this.selectedEmployer = employer.data.filter((emp) => emp.action === store_id)[0];
      });
    }
  }

  ngOnInit() {
    this.buildEmployerForm();
    this.newEmployerTitle = this.cpI18n.translate('jobs_new_employer');
    this.existingEmployerTitle = this.cpI18n.translate('jobs_existing_employer');

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('save')
    };

    this.jobsType = this.utils.getJobsType(true);
    this.employers$ = this.utils.getEmployers('new');
    this.desiredStudy = this.utils.getDesiredStudy(true);

    this._selectedEmployer();
    const _self = this;
    const posting_start = this.form.controls['posting_end'].value;
    const posting_end = this.form.controls['posting_end'].value;
    const contract_start = this.form.controls['contract_start'].value;
    const application_deadline = this.form.controls['application_deadline'].value;

    this.postingStartDatePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: posting_start
        ? CPDate.fromEpoch(this.form.controls['posting_start'].value, _self.session.tz).format()
        : null,
      onClose: function(_, dataStr) {
        _self.form.controls['posting_start'].setValue(CPDate.toEpoch(dataStr, _self.session.tz));
      }
    };

    this.postingEndDatePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: posting_end
        ? CPDate.fromEpoch(this.form.controls['posting_end'].value, _self.session.tz).format()
        : null,
      onClose: function(_, dataStr) {
        _self.form.controls['posting_end'].setValue(CPDate.toEpoch(dataStr, _self.session.tz));
      }
    };

    this.contractStartDatePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: contract_start
        ? CPDate.fromEpoch(this.form.controls['contract_start'].value, _self.session.tz).format()
        : null,
      onClose: function(_, dataStr) {
        _self.form.controls['contract_start'].setValue(CPDate.toEpoch(dataStr, _self.session.tz));
      }
    };

    this.applicationDeadlineDatePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: application_deadline
        ? CPDate.fromEpoch(
            this.form.controls['application_deadline'].value,
            _self.session.tz
          ).format()
        : null,
      onClose: function(_, dataStr) {
        _self.form.controls['application_deadline'].setValue(
          CPDate.toEpoch(dataStr, _self.session.tz)
        );
      }
    };
  }
}
