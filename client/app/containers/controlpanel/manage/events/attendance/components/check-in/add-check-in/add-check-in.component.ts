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
import { EventsService } from '../../../../events.service';
import { CPSession } from './../../../../../../../../session';
import { CPDate } from '../../../../../../../../shared/utils';
import { EventUtilService } from '../../../../events.utils.service';
import { CPI18nService } from '../../../../../../../../shared/services';
import { CheckInMethod, CheckInOutTime } from '../../../../event.status';

@Component({
  selector: 'cp-add-check-in',
  templateUrl: './add-check-in.component.html',
  styleUrls: ['./add-check-in.component.scss']
})
export class AddCheckInComponent implements OnInit {
  @Input() event: any;
  @Input() orientationId: number;

  @Output() created: EventEmitter<ICheckIn> = new EventEmitter();
  @Output() resetAddCheckInModal: EventEmitter<null> = new EventEmitter();

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
    this.resetAddCheckInModal.emit();
    $('#addCheckInModal').modal('hide');
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

    if (this.form.controls['check_out_time_epoch'].value !== CheckInOutTime.empty) {
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
    this.form = this.fb.group({
      email: [null, Validators.required],
      check_in_method: [CheckInMethod.web],
      lastname: [null, Validators.required],
      firstname: [null, Validators.required],
      check_in_time: [null, Validators.required],
      check_out_time_epoch: [CheckInOutTime.empty]
    });

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('save')
    };
  }
}
