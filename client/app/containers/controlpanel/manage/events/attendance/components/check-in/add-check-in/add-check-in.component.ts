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

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CPSession } from './../../../../../../../../session';
import { CPDate } from '../../../../../../../../shared/utils';
import { EventUtilService } from '../../../../events.utils.service';
import { CPI18nService } from '../../../../../../../../shared/services';

@Component({
  selector: 'cp-event-attendance-add-check-in',
  templateUrl: './add-check-in.component.html',
  styleUrls: ['./add-check-in.component.scss']
})
export class AddCheckInComponent implements OnInit {
  @Input() event: any;

  @Output() created: EventEmitter<any> = new EventEmitter(); // todo ICheckIn
  @Output() resetAddCheckInModal: EventEmitter<null> = new EventEmitter();

  formErrors;
  buttonData;
  isDateError;
  form: FormGroup;
  dateErrorMessage;

  constructor(
    public el: ElementRef,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
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
    this.resetAddCheckInModal.emit();
    $('#addCheckInModal').modal('hide');
  }

  onSubmit() {
    this.formErrors = false;

    if (!this.form.valid) {
      this.formErrors = true;
      this.enableSaveButton();

      return;
    }

    if (this.form.controls['check_in_time'].value <= Math.round(CPDate.now(this.session.tz).unix())) {
      this.formErrors = true;
      this.isDateError = true;
      this.enableSaveButton();
      this.form.controls['check_in_time'].setErrors({ required: true });
      this.dateErrorMessage = this.cpI18n.translate('t_events_attendance_add_check_in_error_check_in_time_after_now');

      return;
    }

    if (this.form.controls['check_out_time'].value) {
      if (this.form.controls['check_out_time'].value <= this.form.controls['check_in_time'].value) {
        this.formErrors = true;
        this.isDateError = true;
        this.enableSaveButton();
        this.form.controls['check_out_time'].setErrors({ required: true });
        this.dateErrorMessage = this.cpI18n.translate('t_events_attendance_add_check_in_error_check_out_time_after_check_in');

        return;
      }
    }

    const checkin = [{
      "user_id": 389891,
      "firstname": "Salman",
      "feedback_time": 1533310748,
      "lastname": "Siddique",
      "student_identifier": "",
      "feedback_rating": 80,
      "check_in_time": 1533310748,
      "feedback_text": "This is an orientation event feedback message.",
      "check_in_method": 1,
      "email": "saludada@oohlalamobile.com"
    }];

    this.created.emit(checkin);
    this.resetModal();
  }

  enableSaveButton() {
    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  ngOnInit() {
    this.form = this.fb.group({
      check_out_time: [null],
      email: [null, Validators.required],
      last_name: [null, Validators.required],
      first_name: [null, Validators.required],
      check_in_time: [null, Validators.required]
    });

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('save')
    };
  }
}
