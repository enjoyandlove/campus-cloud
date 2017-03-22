import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Headers } from '@angular/http';

import { API } from '../../../../../config/api';
import { EventsService } from '../events.service';
import { FileUploadService, ErrorService, StoreService } from '../../../../../shared/services';
import { CPArray, CPImage, CPMap, CPDate, appStorage } from '../../../../../shared/utils';

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
    private eventService: EventsService,
    private fileUploadService: FileUploadService
  ) {
    this.form = this.fb.group({
      'title': ['', Validators.required],
      'store_id': [null, Validators.required],
      'location': [''],
      'room_data': [''],
      'city': [''],
      'province': [''],
      'country': [''],
      'address': [''],
      'postal_code': [''],
      'latitude': [''],
      'longitude': [''],
      'event_attendance': [null], // 1 => Enabled
      'start': ['', Validators.required],
      'poster_url': ['', Validators.required],
      'poster_thumb_url': ['', Validators.required],
      'end': ['', Validators.required],
      'description': [''],
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
          this.router.navigate(['../' + res.id]);
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
