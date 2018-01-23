import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { ItemAllDay, IItem } from './../item.interface';
import { CPSession } from './../../../../../../session';

import {
  IHeader,
  HEADER_UPDATE,
} from './../../../../../../reducers/header.reducer';
import { CalendarsService } from '../../calendars.services';

@Component({
  selector: 'cp-calendars-items-create',
  templateUrl: './calendars-items-create.component.html',
  styleUrls: ['./calendars-items-create.component.scss'],
})
export class CalendarsItemCreateComponent implements OnInit {
  @ViewChild('createForm') createForm;

  form: FormGroup;
  calendarId: number;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public route: ActivatedRoute,
    public store: Store<IHeader>,
    public service: CalendarsService,
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
          url: '/manage/calendars',
          label: 'calendars',
        },
        children: [],
      },
    });
  }

  onSave(newItem: IItem) {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);
    search.append('academic_calendar_id', this.calendarId.toString());

    this.service
      .createItem(newItem, search)
      .subscribe((_) =>
        this.router.navigate(['/manage/calendars/' + this.calendarId]),
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
      location: [null],
      country: [null],
      address: [null],
      street_name: [null],
      postal_code: [null],
      street_number: [null],
      province: [null],
      latitude: [this.session.g.get('school').latitude, Validators.required],
      longitude: [this.session.g.get('school').longitude, Validators.required],
    });
  }

  ngOnInit() {
    this.buildForm();
    this.buildHeader();
  }
}
