import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { JobsAmplitudeService } from '@controlpanel/manage/jobs/jobs.amplitude.service';

@Mixin([Destroyable])
@Component({
  selector: 'cp-employer-card',
  templateUrl: './employer-card.component.html',
  styleUrls: ['./employer-card.component.scss']
})
export class EmployerCardComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() employerForm: FormGroup;

  @Output() isNewEmployer: EventEmitter<boolean> = new EventEmitter();
  @Output()
  formData: EventEmitter<{
    job: any;
    jobFormValid: boolean;
    employer: any;
    employerFormValid: boolean;
  }> = new EventEmitter();

  newEmployerTitle;
  existingEmployerTitle;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    public cpI18n: CPI18nService,
    private cpTracking: CPTrackingService,
    private amplitude: JobsAmplitudeService
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

      this.cpTracking.amplitudeEmitEvent(
        amplitudeEvents.CLICKED_CREATE_ITEM,
        this.amplitude.getEmployerAmplitudeClickedItem()
      );
    }
  }

  isStoreRequired(value) {
    const store_id = this.form.controls['store_id'].value;
    this.form.setControl('store_id', new FormControl(store_id, value ? Validators.required : null));
  }

  setRequiredField(value) {
    const name = this.employerForm.controls['name'].value;
    const logo = this.employerForm.controls['logo_url'].value;
    this.employerForm.setControl(
      'name',
      new FormControl(name, value ? [Validators.required, Validators.maxLength(120)] : null)
    );

    this.employerForm.setControl(
      'logo_url',
      new FormControl(logo, value ? Validators.required : null)
    );
  }

  ngOnInit() {
    this.newEmployerTitle = this.cpI18n.translate('jobs_new_employer');
    this.existingEmployerTitle = this.cpI18n.translate('jobs_existing_employer');

    this.employerForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.formData.emit({
        job: this.form.value,
        jobFormValid: this.form.valid,
        employer: this.employerForm.value,
        employerFormValid: this.employerForm.valid
      });
    });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
