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
  datePickerOpts;
  loading = true;
  eventId: number;
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

    this.datePickerOpts = {
      utc: true,
      altInput: true,
      enableTime: true,
      altFormat: 'F j, Y h:i K',
    };
  }

  onSubmit(data) {
    console.log(data);
  }

  private buildForm(res) {
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
    this.isFormReady = true;
  }

  private fetch() {
    super.isLoading().subscribe(res => this.loading = res);

    super
      .fetchData(this.service.getEventById(this.eventId))
      .then(res => {
        this.event = res;
        this.buildHeader();
        this.buildForm(res);
        this.mapCenter = { lat: res.latitude, lng: res.longitude };
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
