import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { BaseComponent } from '../../../../../../base';
import { ICalendar } from '../../calendars.interface';
import { CPSession } from './../../../../../../session';
import { CalendarsService } from '../../calendars.services';
import { CalendarsItemsService } from '../item.utils.service';
import { CPTrackingService } from '../../../../../../shared/services';
import { amplitudeEvents } from '../../../../../../shared/constants/analytics';
import { IHeader, HEADER_UPDATE } from './../../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-calendars-items-edit',
  templateUrl: './calendars-items-edit.component.html',
  styleUrls: ['./calendars-items-edit.component.scss']
})
export class CalendarsItemsEditComponent extends BaseComponent implements OnInit {
  @ViewChild('editForm') editForm;

  item: any;
  itemId: number;
  form: FormGroup;
  loading = true;
  calendarId: number;
  calendar: ICalendar;

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
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));

    this.calendarId = this.route.snapshot.params['calendarId'];
    this.itemId = this.route.snapshot.params['itemId'];
  }

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: 'calendars_item_edit_heading',
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

  onEdit(editedItem) {
    const search = new HttpParams()
      .append('school_id', this.session.g.get('school').id)
      .append('academic_calendar_id', this.calendarId.toString());

    this.service
      .editItem(this.itemId, editedItem, search)
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
      amplitudeEvents.MANAGE_UPDATED_CALENDAR_EVENT,
      this.eventProperties);
  }

  buildForm() {
    this.form = this.fb.group({
      title: [this.item.title, Validators.required],
      description: [this.item.description],
      start: [this.item.start, Validators.required],
      end: [this.item.end, Validators.required],
      is_all_day: [this.item.is_all_day],
      city: [this.item.city],
      room_data: [this.item.room_data],
      location: [this.item.location],
      country: [this.item.country],
      address: [this.item.address],
      street_name: [this.item.street_name],
      postal_code: [this.item.postal_code],
      street_number: [this.item.street_number],
      province: [this.item.province],
      latitude: [this.item.latitude, Validators.required],
      longitude: [this.item.longitude, Validators.required]
    });
  }

  fetch() {
    const search = new HttpParams()
      .append('school_id', this.session.g.get('school').id)
      .append('academic_calendar_id', this.calendarId.toString());

    const item$ = this.service.getItemById(this.itemId, search);

    super.fetchData(item$).then((res) => {
      this.item = res.data;
      this.buildForm();
      this.buildHeader();
    });
  }

  ngOnInit() {
    this.fetch();
  }
}
