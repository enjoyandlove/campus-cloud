import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { ItemAllDay, IItem } from './../item.interface';
import { CPSession } from './../../../../../../session';
import { CalendarsService } from '../../calendars.services';
import { CalendarsItemsService } from '../item.utils.service';
import { CPTrackingService } from '../../../../../../shared/services';
import { amplitudeEvents } from '../../../../../../shared/constants/analytics';
import { IHeader, HEADER_UPDATE } from './../../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-calendars-items-create',
  templateUrl: './calendars-items-create.component.html',
  styleUrls: ['./calendars-items-create.component.scss']
})
export class CalendarsItemCreateComponent implements OnInit {
  @ViewChild('createForm') createForm;

  form: FormGroup;
  calendarId: number;

  eventProperties = {
    all_day: null,
    location: null,
    end_date: null,
    start_date: null,
    calendar_event_id: null
  };

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public route: ActivatedRoute,
    public store: Store<IHeader>,
    public service: CalendarsService,
    public utils: CalendarsItemsService,
    public cpTracking: CPTrackingService
  ) {
    this.calendarId = this.route.snapshot.params['calendarId'];
  }

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
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

    this.service
      .createItem(newItem, search)
      .subscribe((res) => {
        this.trackEvent(res);
        this.router.navigate(['/manage/calendars/' + this.calendarId]);
      });
  }

  trackEvent(data) {
    this.eventProperties = {
      ...this.eventProperties,
      ...this.utils.setEventProperties(data)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_CREATED_CALENDAR_EVENT,
      this.eventProperties);
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
      location: [null],
      country: [null],
      address: [null],
      street_name: [null],
      postal_code: [null],
      street_number: [null],
      province: [null],
      latitude: [this.session.g.get('school').latitude, Validators.required],
      longitude: [this.session.g.get('school').longitude, Validators.required]
    });
  }

  ngOnInit() {
    this.buildForm();
    this.buildHeader();
  }
}
