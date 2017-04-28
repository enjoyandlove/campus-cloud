import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { EventsService } from '../events.service';
import { CPMap, CPDate } from '../../../../../shared/utils';
import { ErrorService, StoreService } from '../../../../../shared/services';

const COMMON_DATE_PICKER_OPTIONS = {
  utc: true,
  altInput: true,
  enableTime: true,
  altFormat: 'F j, Y h:i K'
};

@Component({
  selector: 'cp-events-create',
  templateUrl: './events-create.component.html',
  styleUrls: ['./events-create.component.scss']
})
export class EventsCreateComponent implements OnInit {
  @Input() storeId: number;
  @Input() isClub: boolean;
  @Input() isService: boolean;

  stores$;
  mapCenter;
  imageError;
  form: FormGroup;
  formError = false;
  attendance = false;
  enddatePickerOpts;
  startdatePickerOpts;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private storeService: StoreService,
    private errorService: ErrorService,
    private eventService: EventsService
  ) {
    this.stores$ = this.storeService.getStores().map(res => {
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
  }

  onUploadedImage(image) {
    this.form.controls['poster_url'].setValue(image);
    this.form.controls['poster_thumb_url'].setValue(image);
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

  onSubmit() {
    this.formError = false;
    this.imageError = null;

    if (!this.form.valid) {
      if (!this.form.controls['poster_url'].valid) {
        this.imageError = 'Image is required';
      }
      this.formError = true;
      return;
    }

    this
      .eventService
      .createEvent(this.form.value)
      .subscribe(
      res => {
        if (this.isService) {
          this.router.navigate([`/manage/services/${this.storeId}/events/${res.id}`]);
          return;
        }
        if (this.isClub) {
          this.router.navigate([`/manage/clubs/${this.storeId}/events/${res.id}`]);
          return;
        }
        this.router.navigate(['/manage/events/' + res.id]);
      },
      err => this.errorService.handleError(err)
      );
  }

  ngOnInit() {
    this.form = this.fb.group({
      'title': [null, Validators.required],
      'store_id': [this.storeId ? this.storeId : null, Validators.required],
      'location': [null],
      'room_data': [null],
      'city': [null],
      'province': [null],
      'country': [null],
      'address': [null],
      'postal_code': [null],
      'latitude': [0],
      'longitude': [0],
      'event_attendance': [null], // 1 => Enabled
      'start': [null, Validators.required],
      'poster_url': [null, Validators.required],
      'poster_thumb_url': [null, Validators.required],
      'end': [null, Validators.required],
      'description': [null],
      'event_feedback': [null], // 1 => Enabled
      'event_manager_id': [null],
      'attendance_manager_email': [null]
    });

    let _self = this;

    this.startdatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS,
      onClose: function (date) {
        _self.form.controls['start'].setValue(CPDate.toEpoch(date[0]));
      }
    };

    this.enddatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS,
      onClose: function (date) {
        _self.form.controls['end'].setValue(CPDate.toEpoch(date[0]));
      }
    };
  }
}
