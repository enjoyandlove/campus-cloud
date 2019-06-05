import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { of as observableOf } from 'rxjs';
import { Store } from '@ngrx/store';

import { isDev } from '@app/config/env';
import { CPSession } from '@app/session';
import { BaseComponent } from '@app/base';
import { CPI18nPipe } from '@shared/pipes';
import { IItem } from './../item.interface';
import { CPDate, CPObj } from '@shared/utils';
import { amplitudeEvents } from '@shared/constants';
import { CPTrackingService } from '@shared/services';
import { IHeader, baseActions } from '@app/store/base';
import { CalendarsService } from '../../calendars.services';

const i18n = new CPI18nPipe();

@Component({
  selector: 'cp-calendats-items-bulk-create',
  templateUrl: './calendats-items-bulk-create.component.html',
  styleUrls: ['./calendats-items-bulk-create.component.scss']
})
export class CalendarsItemsBulkCreateComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('createForm', { static: true }) createForm;

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
    public service: CalendarsService,
    public cpTracking: CPTrackingService
  ) {
    super();
    this.calendarId = this.route.snapshot.params['calendarId'];
  }

  getItems() {
    return isDev ? observableOf(require('./mock.json')) : this.service.getItems();
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
      this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_IMPORTED_CALENDAR_EVENT);

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
      type: baseActions.HEADER_UPDATE,
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
          location: [null],
          latitude: [0],
          longitude: [0]
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
