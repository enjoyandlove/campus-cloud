import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../../../reducers/header.reducer';
import { EventsService } from '../events.service';
import { FORMAT } from '../../../../../shared/pipes/date.pipe';
import { BaseComponent } from '../../../../../base/base.component';

import * as moment from 'moment';

@Component({
  selector: 'cp-events-edit',
  templateUrl: './events-edit.component.html',
  styleUrls: ['./events-edit.component.scss']
})
export class EventsEditComponent extends BaseComponent implements OnInit {
  form: FormGroup;
  event;
  mapCenter;
  dateFormat;
  endDatePicker;
  loading = true;
  eventId: number;
  startDatePicker;
  attendance = false;
  isFormReady = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private service: EventsService
  ) {
    super();
    this.dateFormat = FORMAT.DATETIME;
    this.eventId = this.route.snapshot.params['eventId'];

    this.fetch();
  }

  onSubmit(data) {
    console.log(data);
  }

  private buildForm(res) {
    let _self = this;

    this.form = this.fb.group({
      'title': [res.title, Validators.required],
      'store_id': [res.store_id, Validators.required],
      'location': [res.location, Validators.required],
      'room_data': [res.room_data, Validators.required],
      'address': [res.address, Validators.required],
      'start': [res.start, Validators.required],
      'end': [res.end, Validators.required],
      'description': [res.description, Validators.required],
      'attend_verification_methods': [res.attend_verification_methods]
    });

    this.startDatePicker = {
      utc: true,
      defaultDate: new Date(res.start * 1000),
      altInput: true,
      enableTime: true,
      altFormat: 'F j, Y h:i K',
      onChange: function(_, dateStr) {
        _self.form.controls['start'].setValue(moment(dateStr).valueOf());
      }
    };

    this.endDatePicker = {
      utc: true,
      defaultDate: new Date(res.end * 1000),
      altInput: true,
      enableTime: true,
      altFormat: 'F j, Y h:i K',
      onChange: function(_, dateStr) {
        _self.form.controls['end'].setValue(moment(dateStr).valueOf());
      }
    };
    this.isFormReady = true;
  }

  onPlaceChanged(data) {
    this.form.controls['address'].setValue(data.name);
    this.mapCenter = {
      lat: data.geometry.location.lat(),
      lng: data.geometry.location.lng()
    };
  }

  private fetch() {
    super.isLoading().subscribe(res => this.loading = res);

    super
      .fetchData(this.service.getEventById(this.eventId))
      .then(res => {
        this.event = res.data;
        this.buildHeader();
        this.buildForm(res.data);
        this.mapCenter = { lat: res.data.latitude, lng: res.data.longitude };
      })
      .catch(err => console.error(err));
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': 'Edit Event',
        'subheading': '',
        'children': []
      }
    });
  }

  ngOnInit() { }
}
