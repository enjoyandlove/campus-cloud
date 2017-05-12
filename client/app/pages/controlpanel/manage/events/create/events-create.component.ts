import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';

import { EventsService } from '../events.service';
import { CPSession, ISchool } from '../../../../../session';
import { CPMap, CPDate, CP_PRIVILEGES_MAP } from '../../../../../shared/utils';
import { ErrorService, StoreService, AdminService } from '../../../../../shared/services';

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
  @Input() serviceId: number;
  @Input() isService: boolean;

  stores$;
  imageError;
  booleanOptions;
  school: ISchool;
  form: FormGroup;
  formError = false;
  attendance = false;
  enddatePickerOpts;
  startdatePickerOpts;
  managers: Array<any> = [{'label': '---'}];
  mapCenter: BehaviorSubject<any>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private session: CPSession,
    private adminService: AdminService,
    private storeService: StoreService,
    private errorService: ErrorService,
    private eventService: EventsService
  ) {
    this.school = this.session.school;
    let search: URLSearchParams = new URLSearchParams();

    search.append('school_id', this.school.id.toString());

    this.stores$ = this
      .storeService
      .getStores(search)
      .startWith([{ 'label': 'All Host' }])
      .map(res => {
        const stores = [
          {
            'label': 'All Host',
            'value': null
          }
        ];
        res.forEach(store => {
          stores.push({
            'label': store.name,
            'value': store.id
          });
        });
        return stores;
      });
  }

  onSelectedHost(host): void {
    this.fetchManagersBySelectedStore(host.value);
    this.form.controls['store_id'].setValue(host.value);
  }

  fetchManagersBySelectedStore(storeId) {
    let search: URLSearchParams = new URLSearchParams();

    search.append('school_id', this.school.id.toString());
    search.append('store_id', storeId);
    search.append('privilege_type', CP_PRIVILEGES_MAP.events.toString());

    this
    .adminService
    .getAdminByStoreId(search)
    .map(admins => {
      let _admins = [
        {
          'label': '---',
          'action': null
        }
      ];
      admins.forEach(admin => {
        _admins.push({
          'label': `${admin.firstname} ${admin.lastname}`,
          'action': admin.id
        });
      });
      return _admins;
    }).subscribe(
      res => this.managers = res,
      err => console.log(err)
    );
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
    this.form.controls['address'].setValue(data.name);
    this.form.controls['postal_code'].setValue(cpMap.postal_code);

    this.mapCenter.next(data.geometry.location.toJSON());
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

    if (this.form.controls['end'].value <= this.form.controls['start'].value) {
      this.formError = true;
      this.form.controls['end'].setErrors({ 'required': true });
      this.form.controls['start'].setErrors({ 'required': true });
      return;
    }

    this
      .eventService
      .createEvent(this.form.value)
      .subscribe(
      res => {
        if (this.isService) {
          this.router.navigate([`/manage/services/${this.serviceId}/events/${res.id}`]);
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

  onEventFeedbackChange(option) {
    this.form.controls['event_feedback'].setValue(option.value);
  }

  ngOnInit() {
    this.booleanOptions = [
      {
        'label': 'Enabled',
        'action': 1
      },
      {
        'label': 'Disabled',
        'action': 0
      }
    ];

    this.mapCenter = new BehaviorSubject(
      {
        lat: this.school.latitude,
        lng: this.school.longitude
      });

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
      'latitude': [this.school.latitude],
      'longitude': [this.school.longitude],
      'event_attendance': [null], // 1 => Enabled
      'start': [null, Validators.required],
      'poster_url': [null, Validators.required],
      'poster_thumb_url': [null, Validators.required],
      'end': [null, Validators.required],
      'description': [null],
      'event_feedback': [0], // 1 => Enabled
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
