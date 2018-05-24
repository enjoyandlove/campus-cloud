import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IDeal } from '../../deals.interface';
import { IStore } from '../../stores/store.interface';
import { CPSession } from '../../../../../../session';
import { CPDate } from '../../../../../../shared/utils';
import { CPI18nService } from '../../../../../../shared/services';

const COMMON_DATE_PICKER_OPTIONS = {
  utc: true,
  altInput: true,
  enableTime: true,
  altFormat: 'F j, Y h:i K'
};

@Component({
  selector: 'cp-deals-form',
  templateUrl: './deals-form.component.html',
  styleUrls: ['./deals-form.component.scss']
})

export class DealsFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() storeForm: FormGroup;

  @Output() formData: EventEmitter<{
    deal: IDeal;
    dealFormValid: boolean
    store: IStore;
    storeFormValid: boolean
  }> = new EventEmitter();

  postingStartDatePickerOptions;
  postingEndDatePickerOptions;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
  ) {}

  onUploadedImage(image) {
    this.form.controls['image_url'].setValue(image);
    this.form.controls['image_thumb_url'].setValue(image);
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      this.formData.emit({
        deal: this.form.value,
        dealFormValid: this.form.valid,
        store: this.storeForm.value,
        storeFormValid: this.storeForm.valid,
      });
    });

    const _self = this;
    const posting_start = this.form.controls['start'].value;
    const posting_end = this.form.controls['expiration'].value;

    this.postingStartDatePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: posting_start
        ? CPDate.fromEpoch(posting_start, _self.session.tz).format()
        : null,
      onChange: function(_, dataStr) {
        _self.form.controls['start'].setValue(CPDate.toEpoch(dataStr, _self.session.tz));
      }
    };

    this.postingEndDatePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: posting_end
        ? CPDate.fromEpoch(posting_end, _self.session.tz).format()
        : null,
      onChange: function(_, dataStr) {
        _self.form.controls['expiration'].setValue(CPDate.toEpoch(dataStr, _self.session.tz));
      }
    };
  }
}
