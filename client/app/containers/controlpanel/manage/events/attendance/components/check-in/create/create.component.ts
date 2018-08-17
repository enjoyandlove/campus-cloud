import {
  Input,
  OnInit,
  Output,
  Component,
  ElementRef,
  EventEmitter,
  HostListener
} from '@angular/core';

import { HttpParams } from '@angular/common/http';

import { ICheckIn } from '../check-in.interface';
import { EventsService } from '../../../../events.service';
import { CPSession } from './../../../../../../../../session';
import { CheckInUtilsService } from '../check-in.utils.service';
import { EventUtilService } from '../../../../events.utils.service';
import { CPI18nService } from '../../../../../../../../shared/services';

@Component({
  selector: 'cp-create-check-in',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CheckInCreateComponent implements OnInit {
  @Input() event: any;
  @Input() orientationId: number;

  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() created: EventEmitter<ICheckIn> = new EventEmitter();

  form;
  formErrors;
  buttonData;
  errorMessage;

  constructor(
    public el: ElementRef,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: EventsService,
    public utils: EventUtilService,
    public checkInUtils: CheckInUtilsService
  ) {}

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
    $('#addCheckInModal').modal('hide');
  }

  onSubmit() {
    this.formErrors = false;

    if (!this.form.valid) {
      this.formErrors = true;
      this.enableSaveButton();
      this.errorMessage = this.cpI18n.
      translate('t_events_attendance_add_check_in_error_fill_out_all_fields');

      return;
    }

    const checkInTime = this.form.controls['check_in_time'].value;
    const checkOutTime = this.form.controls['check_out_time_epoch'].value;

    const checkinTimeInThePast =
      this.checkInUtils.isCheckinInPast(checkInTime);

    const checkoutTimeBeforeCheckinTime =
      this.checkInUtils.checkoutTimeBeforeCheckinTime(checkInTime, checkOutTime);

    if (checkinTimeInThePast || checkoutTimeBeforeCheckinTime) {
      this.formErrors = true;
      this.enableSaveButton();

      if (checkinTimeInThePast) {
        this.form.controls['check_in_time'].setErrors({ required: true });

        this.errorMessage = this.cpI18n.
        translate('t_events_attendance_add_check_in_error_check_in_time_after_now');

      } else if (checkoutTimeBeforeCheckinTime) {
        this.form.controls['check_out_time_epoch'].setErrors({ required: true });

        this.errorMessage = this.cpI18n.
        translate('t_events_attendance_add_check_in_error_check_out_time_after_check_in');
      }

      return;
    }

    let search = new HttpParams();

    if (this.orientationId) {
      search = search
        .append('school_id', this.session.g.get('school').id)
        .append('calendar_id', this.orientationId.toString());
    }

    this.service.addEventCheckIn(this.form.value, search).subscribe(
      () => {
        this.created.emit();
        this.resetModal();
      },
      (_) => {
        this.formErrors = true;
        this.enableSaveButton();
        this.errorMessage = this.cpI18n.translate('something_went_wrong');
      });
  }

  enableSaveButton() {
    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  ngOnInit() {
    this.form = this.checkInUtils.getCheckInForm(null, this.event.id);

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('save')
    };
  }
}
