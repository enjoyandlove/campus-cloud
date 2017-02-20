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
  dateFormat;
  mapCenter;
  loading = true;
  eventId: number;

  constructor(
    private fb: FormBuilder,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private service: EventsService
  ) {
    super();
    this.dateFormat = FORMAT.DATETIME;
    this.eventId = this.route.snapshot.params['eventId'];

    this.form = this.fb.group({
      'title': ['', Validators.required],
      'store_id': ['', Validators.required],
      'location': ['', Validators.required],
      'room_data': ['', Validators.required],
      'address': ['', Validators.required],
      'start': ['', Validators.required],
      'end': ['', Validators.required],
      'description': ['', Validators.required],
      'attend_verification_methods': ['']
    });

    this.fetch();
  }

  onSubmit(data) {
    console.log(data);
  }

  private fetch() {
    super.isLoading().subscribe(res => this.loading = res);

    super
      .fetchData(this.service.getEventById(this.eventId))
      .then(res => {
        this.event = res;
        this.buildHeader();
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
