import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import {
  Input,
  OnInit,
  Output,
  Component,
  ElementRef,
  EventEmitter,
  HostListener
} from '@angular/core';

import IAttendee from '../attendee.interface';
import { CPDate } from '../../../../../shared/utils';
import { CheckinService } from '../../checkin.service';
import { CPI18nService } from '../../../../../shared/services/i18n.service';

const FORMAT_WITH_TIME = 'F j, Y h:i K';

const COMMON_DATE_PICKER_OPTIONS = {
  altInput: true,
  enableTime: true,
  altFormat: FORMAT_WITH_TIME
};

@Component({
  selector: 'cp-check-out-modal',
  templateUrl: './check-out-modal.component.html',
  styleUrls: ['./check-out-modal.component.scss']
})

export class CheckOutModalComponent implements OnInit {
  @Input() timezone: string;
  @Input() attendee: IAttendee;

  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() checkout: EventEmitter<IAttendee> = new EventEmitter();

  eventId;
  formErrors;
  buttonData;
  errorMessage;
  checkOutOptions;
  form: FormGroup;

  constructor(
    public el: ElementRef,
    public fb: FormBuilder,
    public route: ActivatedRoute,
    public cpI18n: CPI18nService,
    public service: CheckinService
  ) {
    this.eventId = this.route.snapshot.params['event'];
  }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  resetModal() {
    this.form.reset();
    this.teardown.emit();
    $('#checkOutModal').modal('hide');
  }

  onSubmit() {
    this.formErrors = false;
    this.errorMessage = null;
    const checkOutTime = this.form.controls['check_out_time_epoch'];

    if (!this.form.valid) {
      this.formErrors = true;
      this.enableCheckOutButton();

      return;
    }

    if (checkOutTime.value < this.attendee.check_in_time_epoch) {
      this.formErrors = true;
      this.enableCheckOutButton();
      checkOutTime.setErrors({ required: true });
      this.errorMessage = this.cpI18n.translate('t_external_check_in_greater_than_checkout_error');

      return;
    }

    const search = new HttpParams()
      .append('event_id', this.eventId.toString());

    this.service.doEventCheckin(this.form.value, search).subscribe(
      (_) => {
        this.attendee = {
          ...this.attendee,
          check_out_time_epoch: checkOutTime.value
        };

        this.checkout.emit(this.attendee);
        this.resetModal();
      },
      (_) => {
        this.errorMessage = this.cpI18n.translate('something_went_wrong');
      });
  }

  enableCheckOutButton() {
    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  ngOnInit() {
    this.buttonData = {
      class: 'primary',
      disable: false,
      text: this.cpI18n.translate('t_external_check_in_check_out_button')
    };

    const _self = this;
    this.checkOutOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      onChange: function(_, dateStr) {
        _self.form.controls['check_out_time_epoch']
          .setValue(CPDate.toEpoch(dateStr, _self.timezone));
      }
    };

    this.form = this.fb.group({
      email: [this.attendee.email, Validators.required],
      check_out_time_epoch: [null, Validators.required],
      lastname: [this.attendee.lastname, Validators.required],
      firstname: [this.attendee.firstname, Validators.required],
      attendance_id: [this.attendee.attendance_id, Validators.required],
      check_in_time_epoch: [this.attendee.check_in_time_epoch, Validators.required],
    });
  }
}
