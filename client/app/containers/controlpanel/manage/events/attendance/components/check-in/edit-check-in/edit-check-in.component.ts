/* tslint:disable:max-line-length */
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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ICheckIn } from '../check-in.interface';
import { CheckInOutTime } from '../../../../event.status';
import { EventsService } from '../../../../events.service';
import { CPSession } from './../../../../../../../../session';
import { CPDate } from '../../../../../../../../shared/utils';
import { EventUtilService } from '../../../../events.utils.service';
import { CPI18nService } from '../../../../../../../../shared/services';

@Component({
  selector: 'cp-edit-check-in',
  templateUrl: './edit-check-in.component.html',
  styleUrls: ['./edit-check-in.component.scss']
})
export class EditCheckInComponent implements OnInit {
  @Input() event: any;
  @Input() checkIn: ICheckIn;
  @Input() orientationId: number;

  @Output() edited: EventEmitter<null> = new EventEmitter();
  @Output() resetEditCheckInModal: EventEmitter<null> = new EventEmitter();

  formErrors;
  buttonData;
  errorMessage;
  form: FormGroup;

  constructor(
    public el: ElementRef,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: EventsService,
    public utils: EventUtilService) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  resetModal() {
    this.form.reset();
    this.resetEditCheckInModal.emit();
    $('#editCheckInModal').modal('hide');
  }

  onSubmit() {
    this.formErrors = false;

    if (!this.form.valid) {
      this.formErrors = true;
      this.enableSaveButton();
      this.errorMessage = this.cpI18n.translate('t_events_attendance_add_check_in_error_fill_out_all_fields');

      return;
    }

    if (this.form.controls['check_in_time'].value <= Math.round(CPDate.now(this.session.tz).unix())) {
      this.formErrors = true;
      this.enableSaveButton();
      this.form.controls['check_in_time'].setErrors({ required: true });
      this.errorMessage = this.cpI18n.translate('t_events_attendance_add_check_in_error_check_in_time_after_now');

      return;
    }

    if (this.form.controls['check_out_time_epoch'].value !== CheckInOutTime.empty && this.event.has_checkout) {
      if (this.form.controls['check_out_time_epoch'].value <= this.form.controls['check_in_time'].value) {
        this.formErrors = true;
        this.enableSaveButton();
        this.form.controls['check_out_time_epoch'].setErrors({ required: true });
        this.errorMessage = this.cpI18n.translate('t_events_attendance_add_check_in_error_check_out_time_after_check_in');

        return;
      }
    }

    let search = new HttpParams()
      .append('event_id', this.event.id);

    if (this.orientationId) {
      search = search
        .append('school_id', this.session.g.get('school').id)
        .append('calendar_id', this.orientationId.toString());
    }

    this.service.updateEventCheckIn(this.form.value, this.checkIn.id, search).subscribe(
      () => {
        this.edited.emit();
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
    this.form = this.fb.group({
      email: [this.checkIn.email, Validators.required],
      check_in_method: [this.checkIn.check_in_method],
      lastname: [this.checkIn.lastname, Validators.required],
      firstname: [this.checkIn.firstname, Validators.required],
      check_out_time_epoch: [this.checkIn.check_out_time_epoch],
      check_in_time: [this.checkIn.check_in_time, Validators.required]
    });

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('save')
    };
  }
}
