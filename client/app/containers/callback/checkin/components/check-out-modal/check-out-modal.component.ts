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

import { CPDate } from '@shared/utils';
import IAttendee from '../attendee.interface';
import { CheckinService } from '../../checkin.service';
import { CPI18nService } from '@shared/services/i18n.service';
import { CheckinUtilsService } from '../../checkin.utils.service';

const COMMON_DATE_PICKER_OPTIONS = {
  enableTime: true
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
  serviceId;
  providerId;
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
    public service: CheckinService,
    public utils: CheckinUtilsService
  ) {
    this.eventId = this.route.snapshot.params['event'];
    this.serviceId = this.route.snapshot.params['service'];
    this.providerId = this.route.snapshot.params['provider'];
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

    let search = new HttpParams();

    if (this.eventId) {
      search = search.append('event_id', this.eventId.toString());

      this.service
        .doEventCheckin(this.form.value, search, true)
        .subscribe((_) => this.handleSuccess(checkOutTime), (err) => this.handleError(err));
    }

    if (this.serviceId) {
      search = search
        .append('service_id', this.serviceId.toString())
        .append('provider_id', this.providerId.toString());

      this.service
        .doServiceCheckin(this.form.value, search, true)
        .subscribe((_) => this.handleSuccess(checkOutTime), (err) => this.handleError(err));
    }
  }

  enableCheckOutButton() {
    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  handleSuccess(checkOutTime) {
    this.attendee = {
      ...this.attendee,
      check_out_time_epoch: checkOutTime.value
    };

    this.checkout.emit(this.attendee);
    this.resetModal();
  }

  handleError(err) {
    this.formErrors = true;
    this.errorMessage = this.utils.getErrorMessage(err.status);
  }

  setCheckout(date) {
    this.form.controls['check_out_time_epoch'].setValue(CPDate.toEpoch(date, this.timezone));
  }

  ngOnInit() {
    this.buttonData = {
      class: 'primary',
      disable: false,
      text: this.cpI18n.translate('t_external_check_in_check_out_button')
    };

    this.checkOutOptions = {
      ...COMMON_DATE_PICKER_OPTIONS
    };

    this.form = this.fb.group({
      email: [this.attendee.email, Validators.required],
      check_out_time_epoch: [null, Validators.required],
      lastname: [this.attendee.lastname, Validators.required],
      firstname: [this.attendee.firstname, Validators.required],
      attendance_id: [this.attendee.attendance_id, Validators.required],
      check_in_time_epoch: [this.attendee.check_in_time_epoch, Validators.required]
    });
  }
}
