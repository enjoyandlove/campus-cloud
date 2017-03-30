import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Headers } from '@angular/http';
import { Store } from '@ngrx/store';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../../../reducers/header.reducer';
import { API } from '../../../../../config/api';
import { EventsService } from '../events.service';
import { FORMAT } from '../../../../../shared/pipes/date.pipe';
import { BaseComponent } from '../../../../../base/base.component';
import { CPArray, CPImage, CPMap, CPDate, appStorage } from '../../../../../shared/utils';
import { FileUploadService, ErrorService, StoreService } from '../../../../../shared/services';

const COMMON_DATE_PICKER_OPTIONS = {
  // utc: true,
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
    private eventService: EventsService,
    private fileUploadService: FileUploadService
  ) {
    super();
    this.eventId = this.route.snapshot.params['eventId'];

    this.fetch();
    this.buildHeader();
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
          this.router.navigate([`/manage/events/${this.eventId}/info`]);
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

  onFileUpload(file) {
    this.imageError = null;
    const fileExtension = CPArray.last(file.name.split('.'));

    if (!CPImage.isSizeOk(file.size, CPImage.MAX_IMAGE_SIZE)) {
      this.imageError = 'File too Big';
      return;
    }

    if (!CPImage.isValidExtension(fileExtension, CPImage.VALID_EXTENSIONS)) {
      this.imageError = 'Invalid Extension';
      return;
    }

    const headers = new Headers();
    const url = this.eventService.getUploadImageUrl();
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    headers.append('Authorization', auth);

    this
      .fileUploadService
      .uploadFile(file, url, headers)
      .subscribe(
      res => {
        this.form.controls['poster_url'].setValue(res.image_url);
        this.form.controls['poster_thumb_url'].setValue(res.image_url);
      },
      err => console.error(err)
      );
  }

  toggleEventAttendance(value) {
    value = value ? 1 : 0;

    if (value === 1) {
      this.form.controls['event_manager_id'].setValidators(Validators.required);
      this.form.controls['event_feedback'].setValidators(Validators.required);
    } else {
      this.form.controls['event_manager_id'].clearValidators();
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
