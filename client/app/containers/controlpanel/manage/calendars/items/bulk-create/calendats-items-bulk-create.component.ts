import { IItem } from './../item.interface';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { FormArray } from '@angular/forms/src/model';
import { BaseComponent } from '../../../../../../base';
import { isDev } from './../../../../../../config/env';
import { CPSession } from './../../../../../../session';
import { CPDate } from '../../../../../../shared/utils';
import { CPI18nPipe } from '../../../../../../shared/pipes';
import { IHeader, HEADER_UPDATE } from './../../../../../../reducers/header.reducer';
import { CalendarsService } from '../../calendars.services';
import { CPObj } from './../../../../../../shared/utils/object/object';

const i18n = new CPI18nPipe();

@Component({
  selector: 'cp-calendats-items-bulk-create',
  templateUrl: './calendats-items-bulk-create.component.html',
  styleUrls: ['./calendats-items-bulk-create.component.scss']
})
export class CalendarsItemsBulkCreateComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('createForm') createForm;

  items: IItem[] = [];
  ready = false;
  originalData;
  form: FormGroup;
  calendarId: number;
  confirmationData = null;
  launchConfirmationModal = false;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public store: Store<IHeader>,
    public route: ActivatedRoute,
    public service: CalendarsService
  ) {
    super();
    this.calendarId = this.route.snapshot.params['calendarId'];
  }

  getItems() {
    return isDev ? Observable.of(require('./mock.json')) : this.service.getItems();
  }

  onSubmit(items: { items: IItem[] }) {
    const search = new HttpParams()
      .append('school_id', this.session.g.get('school').id)
      .append('academic_calendar_id', this.calendarId.toString());

    const itemsWithNoNullValues = items.items.map((item) => CPObj.cleanNullValues(item));

    this.service.createItem(itemsWithNoNullValues, search).subscribe((confirmationData) => {
      this.launchConfirmationModal = true;
      this.confirmationData = confirmationData;
      this.originalData = items.items;

      setTimeout(
        () => {
          $('#calendarImportsConfirmation').modal();
        },

        1
      );
    });
  }

  buildHeader() {
    const subheading = i18n.transform('calendars_items_import_csv_sub_heading', this.items.length);
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: 'calendars_items_import_csv_heading',
        crumbs: {
          url: `/manage/calendars/${this.calendarId}`,
          label: 'calendars'
        },
        em: `[NOTRANSLATE]${subheading}[NOTRANSLATE]`,
        children: []
      }
    });

    this.ready = true;
  }

  buildControlGroup() {
    const control = <FormArray>this.form.controls['items'];

    this.items.forEach((item: any) => {
      control.push(
        this.fb.group({
          title: [item.title, Validators.required],
          description: [item.description],
          start: [CPDate.toEpoch(item.start_date, this.session.tz), Validators.required],
          end: [CPDate.toEpoch(item.end_date, this.session.tz), Validators.required],
          location: [item.location],
          latitude: [this.session.g.get('school').latitude, Validators.required],
          longitude: [this.session.g.get('school').longitude, Validators.required]
        })
      );
    });
    this.buildHeader();
  }

  buildForm() {
    this.form = this.fb.group({
      items: this.fb.array([])
    });

    this.buildControlGroup();
  }

  ngOnDestroy() {
    this.service.setItems('[]');
  }

  ngOnInit() {
    this.getItems()
      .toPromise()
      .then((res) => {
        this.items = res;
        this.buildForm();
      });
  }
}
