import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { JobDate } from './../../jobs.status';
import { CPSession } from '@campus-cloud/session';
import { CPDate } from '@campus-cloud/shared/utils';
import { JobsUtilsService } from '../../jobs.utils.service';
import { CPI18nService } from '@campus-cloud/shared/services';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';

const COMMON_DATE_PICKER_OPTIONS = {
  enableTime: false
};

@Mixin([Destroyable])
@Component({
  selector: 'cp-jobs-form',
  templateUrl: './jobs-form.component.html',
  styleUrls: ['./jobs-form.component.scss']
})
export class JobsFormComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() newEmployer = false;
  @Input() employerForm: FormGroup;

  @Output()
  formData: EventEmitter<{
    job: any;
    jobFormValid: boolean;
    employer: any;
    employerFormValid: boolean;
  }> = new EventEmitter();

  jobsType;
  buttonData;
  isDateError;
  desiredStudy;
  dateErrorMessage;
  formError = false;
  postingStartDatePickerOptions;
  postingEndDatePickerOptions;
  contractStartDatePickerOptions;
  applicationDeadlineDatePickerOptions;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public utils: JobsUtilsService
  ) {}

  onJobTypeDesiredStudyToggle(name, value) {
    this.form.controls[name].setValue(value);
  }

  toggleOngoing(): void {
    const deadline = this.form.controls['posting_end'].value;

    this.form.controls['ongoing'].setValue(!this.form.controls['ongoing'].value);

    if (this.form.controls['ongoing'].value) {
      this.form.controls['posting_end'].setValue(JobDate.forever);
    } else {
      this.form.controls['posting_end'].setValue(deadline);
      this.postingEndDatePickerOptions.defaultDate =
        deadline > 0 ? CPDate.fromEpochLocal(deadline, this.session.tz).format() : null;
    }
  }

  setPostingStart(date) {
    this.form.controls['posting_start'].setValue(CPDate.toEpoch(date, this.session.tz));
  }

  setPostingEnd(date) {
    this.form.controls['posting_end'].setValue(CPDate.toEpoch(date, this.session.tz));
  }

  setContractStart(date) {
    this.form.controls['contract_start'].setValue(
      date ? CPDate.toEpoch(date, this.session.tz) : JobDate.forever
    );
  }

  setApplicationDeadline(date) {
    this.form.controls['application_deadline'].setValue(
      date ? CPDate.toEpoch(date, this.session.tz) : JobDate.forever
    );
  }

  ngOnInit() {
    this.jobsType = this.utils.getJobsType(true);
    this.desiredStudy = this.utils.getDesiredStudy(true);

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.formData.emit({
        job: this.form.value,
        jobFormValid: this.form.valid,
        employer: this.employerForm.value,
        employerFormValid: this.employerForm.valid
      });
    });

    const _self = this;
    const posting_start = this.form.controls['posting_start'].value;
    const posting_end = this.form.controls['posting_end'].value;
    const contract_start = this.form.controls['contract_start'].value;
    const application_deadline = this.form.controls['application_deadline'].value;

    this.postingStartDatePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: this.utils.isDateSet(posting_start)
        ? CPDate.fromEpochLocal(posting_start, _self.session.tz).format()
        : null
    };

    this.postingEndDatePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: this.utils.isDateSet(posting_end)
        ? CPDate.fromEpochLocal(posting_end, _self.session.tz).format()
        : null
    };

    this.contractStartDatePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: this.utils.isDateSet(contract_start)
        ? CPDate.fromEpochLocal(contract_start, _self.session.tz).format()
        : null
    };

    this.applicationDeadlineDatePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: this.utils.isDateSet(application_deadline)
        ? CPDate.fromEpochLocal(application_deadline, _self.session.tz).format()
        : null,
      onChange: function(_, dataStr) {
        _self.form.controls['application_deadline'].setValue(
          CPDate.toEpoch(dataStr, _self.session.tz)
        );
      }
    };
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
