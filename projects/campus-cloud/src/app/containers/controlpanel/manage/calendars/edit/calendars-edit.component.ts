import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '@campus-cloud/session';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { CalendarsService } from '../calendars.services';
import { CalendarAmplitudeService } from '../calendar.amplitude.service';

@Component({
  selector: 'cp-calendars-edit',
  templateUrl: './calendars-edit.component.html',
  styleUrls: ['./calendars-edit.component.scss']
})
export class CalendarsEditComponent implements OnInit {
  @ViewChild('editForm', { static: true }) editForm;

  @Input() calendar;

  @Output()
  edited: EventEmitter<{
    name: string;
    description: string;
  }> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();

  form: FormGroup;

  constructor(
    public el: ElementRef,
    public fb: FormBuilder,
    public session: CPSession,
    public service: CalendarsService,
    public cpTracking: CPTrackingService
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  resetModal() {
    this.reset.emit();
    this.editForm.form.reset();
    $('#calendarEdit').modal('hide');
  }

  onSubmit() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    this.service
      .editCalendar(this.calendar.id, this.form.value, search)
      .subscribe((editedCalendar: any) => {
        this.edited.emit(editedCalendar);
        this.resetModal();
      });

    this.trackEvent();
    this.edited.emit(this.editForm.form.value);
    this.resetModal();
  }

  trackEvent() {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_UPDATED_CALENDAR,
      CalendarAmplitudeService.getCalendarUpdateEventProperties(this.editForm.form)
    );
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [this.calendar.id, Validators.required],
      name: [this.calendar.name, [Validators.required, Validators.maxLength(225)]],
      created_time: [this.calendar.created_time],
      description: [this.calendar.description, Validators.maxLength(512)]
    });
  }
}
