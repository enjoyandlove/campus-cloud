import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

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
  clubId;
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
    private route: ActivatedRoute,
    private storeService: StoreService,
    private errorService: ErrorService,
    private eventService: EventsService
  ) {
    this.clubId = this.route.parent.parent.snapshot.params['clubId'];

    this.form = this.fb.group({
      'title': [null, Validators.required],
      'store_id': [this.clubId ? this.clubId : null, Validators.required],
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
    console.log(image);
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
          this.router.navigate(['/manage/events/' + res.id]);
        },
        err => this.errorService.handleError(err)
      );
  }

  ngOnInit() {
    let _self = this;
    this.startdatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS,
      onClose: function(date) {
        _self.form.controls['start'].setValue(CPDate.toEpoch(date[0]));
      }
    };
    this.enddatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS,
      onClose: function(date) {
        _self.form.controls['end'].setValue(CPDate.toEpoch(date[0]));
      }
    };
  }
}
