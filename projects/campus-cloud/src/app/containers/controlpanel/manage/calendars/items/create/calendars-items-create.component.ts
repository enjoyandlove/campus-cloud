import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { CPSession } from '@campus-cloud/session';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { IHeader, baseActions } from '@campus-cloud/store/base';
import { ItemAllDay, IItem } from './../item.interface';
import { CalendarsService } from '../../calendars.services';
import { CalendarAmplitudeService } from '../../calendar.amplitude.service';

@Component({
  selector: 'cp-calendars-items-create',
  templateUrl: './calendars-items-create.component.html',
  styleUrls: ['./calendars-items-create.component.scss']
})
export class CalendarsItemCreateComponent implements OnInit {
  @ViewChild('createForm', { static: true }) createForm;

  form: FormGroup;
  calendarId: number;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public route: ActivatedRoute,
    public store: Store<IHeader>,
    public service: CalendarsService,
    public cpTracking: CPTrackingService
  ) {
    this.calendarId = this.route.snapshot.params['calendarId'];
  }

  buildHeader() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: 'calendars_item_create_heading',
        subheading: null,
        em: null,
        crumbs: {
          url: null,
          label: null
        },
        children: []
      }
    });
  }

  onSave(newItem: IItem) {
    const search = new HttpParams()
      .append('school_id', this.session.g.get('school').id)
      .append('academic_calendar_id', this.calendarId.toString());

    this.service.createItem(newItem, search).subscribe((res: IItem) => {
      this.trackEvent(res);
      this.router.navigate(['/manage/calendars/' + this.calendarId]);
    });
  }

  trackEvent(item: IItem) {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_CREATED_CALENDAR_EVENT,
      CalendarAmplitudeService.getCalendarEventItemProperties(item)
    );
  }

  buildForm() {
    this.form = this.fb.group({
      title: [null, Validators.required],
      description: [null],
      start: [null, Validators.required],
      end: [null, Validators.required],
      is_all_day: [ItemAllDay.false],
      city: [null],
      room_data: [null],
      location: [null, Validators.required],
      country: [null],
      address: [null],
      street_name: [null],
      postal_code: [null],
      street_number: [null],
      province: [null],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required]
    });
  }

  ngOnInit() {
    this.buildForm();
    this.buildHeader();
  }
}
