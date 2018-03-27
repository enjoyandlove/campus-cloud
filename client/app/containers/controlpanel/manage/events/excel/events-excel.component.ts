import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { isDev } from '../../../../../config/env';
import { CPDate } from '../../../../../shared/utils';
import { CPSession, ISchool } from '../../../../../session';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { CPI18nPipe } from './../../../../../shared/pipes/i18n/i18n.pipe';
import { STATUS } from '../../../../../shared/constants';
import { CPImageUploadComponent } from '../../../../../shared/components';
import { EventUtilService } from '../events.utils.service';
import { EventAttendance, EventFeedback, IsAllDay } from '../event.status';
import {
  FileUploadService,
  CPI18nService,
  StoreService,
  AdminService
} from '../../../../../shared/services';

const i18n = new CPI18nPipe();

@Component({
  selector: 'cp-events-excel',
  templateUrl: './events-excel.component.html',
  styleUrls: ['./events-excel.component.scss'],
})
export class EventsExcelComponent extends BaseComponent implements OnInit {
  @Input() storeId: number;
  @Input() isAthletic: number;

  @Input() clubId: number;
  @Input() isClub: boolean;
  @Input() serviceId: number;
  @Input() isService: boolean;
  @Input() isChecked: boolean;
  @Input() orientationId: number;
  @Input() isOrientation: boolean;

  error;
  events;
  stores;
  urlPrefix;
  formError;
  buttonData;
  uploadButtonData;
  isSingleChecked = [];
  school: ISchool;
  loading = false;
  form: FormGroup;
  isFormReady = false;
  eventAttendanceFeedback;
  resetManagerDropdown$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private service: EventsService,
    private utils: EventUtilService,
    private adminService: AdminService,
    private storeService: StoreService,
    private fileUploadService: FileUploadService,
  ) {
    super();
    this.school = this.session.g.get('school');
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  private fetch() {
    const search: URLSearchParams = new URLSearchParams();
    search.append('school_id', this.school.id.toString());

    const stores$ = this.storeService.getStores(search);

    super
      .fetchData(stores$)
      .then((res) => {
        this.buildForm();
        this.buildHeader();
        this.stores = res.data;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  private buildHeader() {
    const subheading = i18n.transform(
      'events_import_csv_sub_heading',
      this.events.length,
    );
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: 'events_import_csv_heading',
        crumbs: {
          url: this.urlPrefix,
          label: 'events',
        },
        em: `[NOTRANSLATE]${subheading}[NOTRANSLATE]`,
        children: [],
      },
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      events: this.fb.array([]),
    });
    this.buildGroup();

    if (this.isService) {
      this.updateManagersByStoreOrClubId(this.serviceId);
    }
    if (this.isClub) {
      this.updateManagersByStoreOrClubId(this.clubId);
    }
    if (this.isOrientation) {
      this.updateManagersByStoreOrClubId(null);
    }

    this.form.valueChanges.subscribe((_) => {
      this.buttonData = Object.assign({}, this.buttonData, {
        disabled: !this.form.valid,
      });
    });
  }

  private buildGroup() {
    const control = <FormArray>this.form.controls['events'];

    this.events.forEach((event, index) => {
      control.push(this.buildEventControl(event));
      this.isSingleChecked.push({ index, checked: false });
    });

    this.isFormReady = true;
  }

  removeControl(index) {
    const control = <FormArray>this.form.controls['events'];
    control.removeAt(index);
  }

  buildEventControl(event) {
    let store_id;

    if (this.storeId) {
      store_id = this.storeId;
    }

    if (this.clubId) {
      store_id = this.clubId;
    }

    return this.fb.group({
      store_id: [store_id ? store_id : null, !this.isOrientation ? Validators.required : null],
      calendar_id: [this.orientationId, this.isOrientation ? Validators.required : null],
      room: [event.room],
      is_all_day: [IsAllDay.enabled],
      title: [event.title, Validators.required],
      poster_url: [null, Validators.required],
      poster_thumb_url: [null, Validators.required],
      location: [event.location],
      managers: [[{ label: '---', event: null }]],
      description: [event.description],
      end: [CPDate.toEpoch(event.end_date), Validators.required],
      start: [CPDate.toEpoch(event.start_date), Validators.required],
      // these controls are only required when event attendance is true
      attendance_manager_email: [null],
      event_manager_id: [null],
      event_attendance: [EventAttendance.enabled],
      event_feedback: [EventFeedback.enabled],
    });
  }

  updateEventManager(manager, index) {
    const controls = <FormArray>this.form.controls['events'];
    const control = <FormGroup>controls.controls[index];

    control.controls['event_manager_id'].setValue(manager.value);
  }

  updateAttendanceFeedback(feedback, index) {
    const controls = <FormArray>this.form.controls['events'];
    const control = <FormGroup>controls.controls[index];

    control.controls['event_feedback'].setValue(feedback.event);
  }

  onBulkChange(actions) {
    const control = <FormArray>this.form.controls['events'];

    this.isSingleChecked.map((item) => {
      if (item.checked) {
        const ctrl = <FormGroup>control.controls[item.index];

        Object.keys(actions).forEach((key) => {
          ctrl.controls[key].setValue(actions[key]);
        });
      }

      return item;
    });
  }

  onSingleHostSelected(host, index) {
    const controls = <FormArray>this.form.controls['events'];
    const control = <FormGroup>controls.controls[index];
    const managers$ = this.getManagersByHostId(host.value);

    managers$.subscribe((res) => {
      control.controls['managers'].setValue(res);
    });

    this.resetManagerDropdown$.next(true);
    control.controls['event_manager_id'].setValue(null);
    control.controls['store_id'].setValue(host.value);
  }

  updateManagersByStoreOrClubId(storeOrClubId) {
    const events = <FormArray>this.form.controls['events'];
    const managers$ = this.getManagersByHostId(storeOrClubId);
    const groups = events.controls;

    managers$.subscribe((managers) => {
      groups.forEach((group: FormGroup) => {
        group.controls['managers'].setValue(managers);
      });
    });
  }

  getManagersByHostId(storeOrClubId): Observable<any> {
    const search: URLSearchParams = new URLSearchParams();

    search.append('school_id', this.school.id.toString());
    search.append('store_id', storeOrClubId);
    search.append('privilege_type', this.utils.getPrivilegeType(this.isOrientation));

    return this.adminService
      .getAdminByStoreId(search)
      .startWith([{ label: '---' }])
      .map((admins) => {
        const _admins = [
          {
            label: '---',
            value: null,
          },
        ];
        admins.forEach((admin) => {
          _admins.push({
            label: `${admin.firstname} ${admin.lastname}`,
            value: admin.id,
          });
        });

        return _admins;
      });
  }

  onSingleCheck(checked, index) {
    const isChecked = this.isSingleChecked.map((item) => {
      if (item.index === index) {
        item = Object.assign({}, item, { checked: checked });
      }

      return item;
    });

    const getOnlyChecked = isChecked.filter((item) => item.checked);

    const isParentChecked = isChecked.length === getOnlyChecked.length;
    const getChecked = getOnlyChecked.length > 0;
    this.updateUploadPictureButtonStatus(getChecked);
    this.updateParentCheckedStatus(isParentChecked);
    this.isSingleChecked = [...isChecked];
  }

  onCheckAll(checked) {
    const isChecked = [];

    this.isSingleChecked.map((item) => {
      isChecked.push(Object.assign({}, item, { checked: checked }));
    });
    this.updateUploadPictureButtonStatus(checked);
    this.isSingleChecked = [...isChecked];

  }

  resetAllCheckboxes(checked, index) {
    this.onCheckAll(false);
    this.onSingleCheck(checked, index);
  }

  updateParentCheckedStatus(checked) {
    this.isChecked = checked;
  }

  updateUploadPictureButtonStatus(checked) {
    const className = checked ? 'cancel' : 'disabled';

    this.uploadButtonData = {
      class: className
    };
    this.isChecked = checked;
  }

  onHostBulkChange(store_id) {
    this.onBulkChange({ store_id });
  }

  onImageBulkChange(poster_url) {
    this.onBulkChange({ poster_url });
    this.onBulkChange({ poster_thumb_url: poster_url });
  }

  onRemoveImage(index: number) {
    const eventControl = <FormArray>this.form.controls['events'];
    const control = <FormGroup>eventControl.at(index);
    control.controls['poster_url'].setValue(null);
  }

  onImageUpload(image: string, index: number) {
    const imageUpload = new CPImageUploadComponent(this.cpI18n, this.fileUploadService);
    const promise = imageUpload.onFileUpload(image, true);

    promise
      .then((res: any) => {
        const controls = <FormArray>this.form.controls['events'];
        const control = <FormGroup>controls.controls[index];
        control.controls['poster_url'].setValue(res.image_url);
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  onSubmit() {
    this.error = null;
    const _events = [];
    this.formError = false;
    let requiredFieldsError = false;
    const events = Object.assign({}, this.form.controls['events'].value);

    const eventsData = <FormArray>this.form.controls['events'];
    const eventGroups = eventsData.controls;

    Object.keys(eventGroups).forEach((index) => {
      const controls = eventGroups[index].controls;
      if (controls.event_attendance.value === EventAttendance.enabled) {
        if (!controls.event_manager_id.value) {
          requiredFieldsError = true;
          controls.event_manager_id.setErrors({ required: true });
        }
        if (!controls.event_attendance.value) {
          requiredFieldsError = true;
          controls.event_attendance.setErrors({ required: true });
        }
      }
    });

    if (requiredFieldsError || !this.form.valid) {
      this.formError = true;
      this.error = STATUS.ALL_FIELDS_ARE_REQUIRED;
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });

      return;
    }

    Object.keys(events).forEach((key) => {
      let store_id;

      if (this.storeId) {
        store_id = this.storeId;
      }

      if (this.clubId) {
        store_id = this.clubId;
      }
      let _event = {
        title: events[key].title,
        calendar_id: this.orientationId,
        is_all_day: IsAllDay.disabled,
        store_id: store_id ? store_id : events[key].store_id,
        description: events[key].description,
        end: events[key].end,
        room: events[key].room,
        start: events[key].start,
        location: events[key].location,
        poster_url: events[key].poster_url,
        poster_thumb_url: events[key].poster_thumb_url,
        event_attendance: events[key].event_attendance,
      };

      if (events[key].event_attendance === EventAttendance.enabled) {
        _event = Object.assign({}, _event, {
          event_feedback: events[key].event_feedback,
          event_manager_id: events[key].event_manager_id,
          attendance_manager_email: events[key].attendance_manager_email,
        });
      }

      _events.push(_event);
    });

    this.service.createEvent(_events).subscribe(
      (_) => {
        this.router.navigate([this.urlPrefix]);

        return;
      },
      (err) => {
        this.formError = true;
        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false,
        });

        if (err.status === 400) {
          this.error = STATUS.ALL_FIELDS_ARE_REQUIRED;

          return;
        }

        this.error = STATUS.SOMETHING_WENT_WRONG;
      },
    );
  }

  toggleSingleEventAttendance(checked, index) {
    const controls = <FormArray>this.form.controls['events'];
    const control = <FormGroup>controls.controls[index];

    control.controls['event_manager_id'].setValue(null);
    control.controls['event_attendance'].setValue(checked
      ? EventAttendance.enabled
      : EventAttendance.disabled);
  }

  ngOnInit() {
    this.urlPrefix = this.utils.buildUrlPrefix(
      this.clubId,
      this.serviceId,
      this.isAthletic,
      this.orientationId,
    );

    this.isChecked = false;
    this.uploadButtonData = {
      class: 'disabled',
      disabled: true
    };

    this.buttonData = {
      text: 'Import Events',
      class: 'primary',
      disabled: true
    };

    this.store.select('EVENTS_MODAL').subscribe((res) => {
      this.events = !isDev ? res : require('./mock.json');
      // this.events = res;

      if (!this.storeId && !this.clubId && !this.isOrientation) {
        this.fetch();

        return;
      }

      this.buildForm();
      this.buildHeader();
    });

    this.eventAttendanceFeedback = [
      {
        label: 'Enabled',
        event: 1,
      },
      {
        label: 'Disabled',
        event: 0,
      },
    ];
  }
}
