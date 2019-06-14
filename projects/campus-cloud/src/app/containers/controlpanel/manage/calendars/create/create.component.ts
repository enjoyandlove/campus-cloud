import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  HostListener,
  ElementRef,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '@campus-cloud/session';
import { ICalendar } from '../calendars.interface';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { CalendarsService } from '../calendars.services';
import { CalendarAmplitudeService } from '../calendar.amplitude.service';

@Component({
  selector: 'cp-calendars-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CalendarsCreateComponent implements OnInit {
  @ViewChild('createForm', { static: true }) createForm;

  @Output()
  created: EventEmitter<{
    name: string;
    description: string;
  }> = new EventEmitter();

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
    this.createForm.form.reset();
    $('#calendarsCreate').modal('hide');
  }

  onSubmit() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    this.service.createCalendar(this.form.value, search).subscribe((createdCalendar: any) => {
      this.trackEvent(createdCalendar);
      this.created.emit(createdCalendar);
      this.resetModal();
    });
  }

  trackEvent(calendar: ICalendar) {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_CREATED_CALENDAR,
      CalendarAmplitudeService.getCalendarEventProperties(calendar)
    );
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(225)]],
      description: [null, Validators.maxLength(512)]
    });
  }
}
