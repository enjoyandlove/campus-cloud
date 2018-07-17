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

import { CPSession } from './../../../../../session';
import { CalendarsService } from '../calendars.services';
import { CPTrackingService } from '../../../../../shared/services';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';

@Component({
  selector: 'cp-calendars-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CalendarsCreateComponent implements OnInit {
  @ViewChild('createForm') createForm;

  @Output()
  created: EventEmitter<{
    name: string;
    description: string;
  }> = new EventEmitter();

  form: FormGroup;

  eventProperties = {
    calendar_id: null
  };

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

  trackEvent(res) {
    this.eventProperties = {
      ...this.eventProperties,
      calendar_id: res.id
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_CREATED_CALENDAR,
      this.eventProperties);
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(225)]],
      description: [null, Validators.maxLength(512)]
    });
  }
}
