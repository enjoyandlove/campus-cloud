import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IDeal } from '../../deals.interface';
import { DateStatus } from '../../deals.service';
import { IStore } from '../../stores/store.interface';
import { CPSession } from '../../../../../../session';
import { CPDate } from '../../../../../../shared/utils';
import { amplitudeEvents } from '../../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '../../../../../../shared/services';

const COMMON_DATE_PICKER_OPTIONS = {
  enableTime: true
};
@Component({
  selector: 'cp-deals-form',
  templateUrl: './deals-form.component.html',
  styleUrls: ['./deals-form.component.scss']
})
export class DealsFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() storeForm: FormGroup;

  @Output()
  formData: EventEmitter<{
    deal: IDeal;
    dealFormValid: boolean;
    store: IStore;
    storeFormValid: boolean;
  }> = new EventEmitter();

  postingStartDatePickerOptions;
  postingEndDatePickerOptions;
  expiration: number;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public cpTracking: CPTrackingService
  ) {}

  onUploadedImage(image) {
    this.form.controls['image_url'].setValue(image);
    this.form.controls['image_thumb_url'].setValue(image);

    if (image) {
      this.trackUploadImageEvent();
    }
  }

  trackUploadImageEvent() {
    const properties = this.cpTracking.getEventProperties();

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.UPLOADED_PHOTO, properties);
  }

  toggleOngoing(): void {
    this.form.controls['ongoing'].setValue(!this.form.controls['ongoing'].value);
    if (this.form.controls['ongoing'].value) {
      this.expiration = this.form.controls['expiration'].value;
      this.form.controls['expiration'].setValue(DateStatus.forever);
    } else {
      this.form.controls['expiration'].setValue(this.expiration);
      this.postingEndDatePickerOptions.defaultDate =
        this.expiration > 0
          ? CPDate.fromEpochLocal(this.expiration, this.session.tz).format()
          : null;
    }
  }

  setPostingStart(date) {
    this.form.controls['start'].setValue(CPDate.toEpoch(date, this.session.tz));
  }

  setPostingEnd(date) {
    this.form.controls['expiration'].setValue(CPDate.toEpoch(date, this.session.tz));
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      this.formData.emit({
        deal: this.form.value,
        dealFormValid: this.form.valid,
        store: this.storeForm.value,
        storeFormValid: this.storeForm.valid
      });
    });

    const _self = this;
    const posting_start = this.form.controls['start'].value;
    const posting_end = this.form.controls['expiration'].value;

    this.postingStartDatePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: posting_start
        ? CPDate.fromEpochLocal(posting_start, _self.session.tz).format()
        : null
    };

    this.postingEndDatePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: posting_end
        ? CPDate.fromEpochLocal(posting_end, _self.session.tz).format()
        : null
    };
  }
}
