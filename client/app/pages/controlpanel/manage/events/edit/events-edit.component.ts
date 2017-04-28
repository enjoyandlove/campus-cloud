import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../../../reducers/header.reducer';
import { EventsService } from '../events.service';
import { CPMap, CPDate } from '../../../../../shared/utils';
import { FORMAT } from '../../../../../shared/pipes/date.pipe';
import { BaseComponent } from '../../../../../base/base.component';
import { ErrorService, StoreService } from '../../../../../shared/services';

const COMMON_DATE_PICKER_OPTIONS = {
  altInput: true,
  enableTime: true,
  altFormat: 'F j, Y h:i K'
};

@Component({
  selector: 'cp-events-edit',
  templateUrl: './events-edit.component.html',
  styleUrls: ['./events-edit.component.scss']
})
export class EventsEditComponent extends BaseComponent implements OnInit {
  @Input() storeId: number;
  @Input() isClub: boolean;
  @Input() isService: boolean;

  form: FormGroup;
  event;
  stores;
  mapCenter;
  dateFormat;
  imageError;
  loading = true;
  eventId: number;
  enddatePickerOpts;
  formError = false;
  attendance = false;
  isFormReady = false;
  startdatePickerOpts;
  formMissingFields = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private errorService: ErrorService,
    private eventService: EventsService
  ) {
    super();
    this.eventId = this.route.snapshot.params['eventId'];

    this.fetch();
    this.buildHeader();
  }

  onUploadedImage(image) {
    this.form.controls['poster_url'].setValue(image);
    this.form.controls['poster_thumb_url'].setValue(image);
  }

  onSubmit(data) {
    this.formMissingFields = false;
    this.imageError = null;

    if (!this.form.valid) {
      if (!this.form.controls['poster_url'].valid) {
        this.imageError = 'Image is required';
      }
      this.formMissingFields = true;
      return;
    }

    this
      .eventService
      .updateEvent(data, this.eventId)
      .subscribe(
        _ => {
          if (this.isService) {
            this.router.navigate([`/manage/services/${this.storeId}/events/${this.eventId}`]);
            return;
          }
          if (this.isClub) {
            this.router.navigate([`/manage/clubs/${this.storeId}/events/${this.eventId}`]);
            return;
          }
          this.router.navigate(['/manage/events/' + this.eventId]);
          },
        _ => this.formError = true
      );
  }

  private buildForm(res) {
    this.form = this.fb.group({
      'title': [res.title, Validators.required],
      'store_id': [res.store_id, Validators.required],
      'location': [res.location],
      'room_data': [res.room_data],
      'city': [res.city],
      'province': [res.province],
      'country': [res.country],
      'address': [res.address],
      'postal_code': [res.postal_code],
      'latitude': [res.latitude],
      'longitude': [res.longitude],
      'event_attendance': [res.event_attendance],
      'start': [res.start, Validators.required],
      'end': [res.end, Validators.required],
      'poster_url': [res.poster_url, Validators.required],
      'poster_thumb_url': [res.poster_thumb_url, Validators.required],
      'description': [res.description],
      'event_feedback': [res.event_feedback],
      'event_manager_id': [res.event_manager_id],
      'attendance_manager_email': [res.attendance_manager_email]
    });

    this.updateDatePicker();
    this.isFormReady = true;
  }

  updateDatePicker() {
    let _self = this;

    this.startdatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: CPDate.fromEpoch(this.form.controls['start'].value),
      onClose: function (date) {
        _self.form.controls['start'].setValue(CPDate.toEpoch(date[0]));
      }
    };
    this.enddatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: CPDate.fromEpoch(this.form.controls['end'].value),
      onClose: function (date) {
        _self.form.controls['end'].setValue(CPDate.toEpoch(date[0]));
      }
    };
  }

  private fetch() {
    super.isLoading().subscribe(res => this.loading = res);

    const event$ = this.eventService.getEventById(this.eventId);
    const stores$ = this.storeService.getStores().map(res => {
      const stores = [
        {
          'name': 'All Host',
          'value': null
        }
      ];
      res.forEach(store => {
        stores.push({
          'name': store.name,
          'value': store.id
        });
      });
      return stores;
    });

    const stream$ = Observable.combineLatest(event$, stores$);

    super
      .fetchData(stream$)
      .then(res => {
        this.stores = res.data[1];
        this.event = res.data[0];
        this.buildForm(res.data[0]);
        this.mapCenter = { lat: res.data[0].latitude, lng: res.data[0].longitude };
      })
      .catch(err => this.errorService.handleError(err));
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

  toggleEventAttendance(value) {
    value = value ? 1 : 0;

    if (value === 1) {
      this.form.controls['event_manager_id'].setValue(16685);
      this.form.controls['event_feedback'].setValidators(Validators.required);
    } else {
      this.form.controls['event_manager_id'].setValue(null);
      this.form.controls['event_feedback'].clearValidators();
    }

    this.form.controls['event_attendance'].setValue(value);
  }

  onPlaceChange(data) {
    let cpMap = CPMap.getBaseMapObject(data);

    this.form.controls['city'].setValue(cpMap.city);
    this.form.controls['province'].setValue(cpMap.province);
    this.form.controls['country'].setValue(cpMap.country);
    this.form.controls['latitude'].setValue(cpMap.latitude);
    this.form.controls['longitude'].setValue(cpMap.longitude);
    this.form.controls['address'].setValue(`${cpMap.street_number} ${cpMap.street_name}`);
    this.form.controls['postal_code'].setValue(cpMap.postal_code);

    this.mapCenter = data.geometry.location.toJSON();
  }

  ngOnInit() {
    this.dateFormat = FORMAT.DATETIME;
  }
}
