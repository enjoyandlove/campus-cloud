import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { ICalendar } from '../../calendars.interface';
import { IHeader, baseActions } from '@campus-cloud/store/base';
import { CalendarsService } from '../../calendars.services';
import { CalendarAmplitudeService } from '../../calendar.amplitude.service';

@Component({
  selector: 'cp-calendars-items-edit',
  templateUrl: './calendars-items-edit.component.html',
  styleUrls: ['./calendars-items-edit.component.scss']
})
export class CalendarsItemsEditComponent extends BaseComponent implements OnInit {
  @ViewChild('editForm', { static: true }) editForm;

  item: any;
  itemId: number;
  form: FormGroup;
  loading = true;
  calendarId: number;
  calendar: ICalendar;
  amplitudeLocationStatus = amplitudeEvents.NO_CHANGES;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public route: ActivatedRoute,
    public store: Store<IHeader>,
    public service: CalendarsService,
    public cpTracking: CPTrackingService
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));

    this.calendarId = this.route.snapshot.params['calendarId'];
    this.itemId = this.route.snapshot.params['itemId'];
  }

  buildHeader() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
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

  onChangeLocation(amplitudeLocationStatus: string) {
    this.amplitudeLocationStatus = amplitudeLocationStatus;
  }

  onEdit(editedItem) {
    const search = new HttpParams()
      .append('school_id', this.session.g.get('school').id)
      .append('academic_calendar_id', this.calendarId.toString());

    this.service.editItem(this.itemId, editedItem, search).subscribe(() => {
      this.trackEvent();
      this.router.navigate(['/manage/calendars/' + this.calendarId]);
    });
  }

  trackEvent() {
    const desc = this.editForm.form.get('description');
    const eventProperties = {
      calendar_event_id: this.calendarId,
      updated_location: this.amplitudeLocationStatus,
      updated_description: CalendarAmplitudeService.getDescriptionStatus(desc)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_UPDATED_CALENDAR_EVENT,
      eventProperties
    );
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
