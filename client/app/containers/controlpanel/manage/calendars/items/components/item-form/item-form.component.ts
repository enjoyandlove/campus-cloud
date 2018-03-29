import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CPSession } from './../../../../../../../session';
import { CPI18nService } from '../../../../../../../shared/services';
import { CPDate, CPMap } from '../../../../../../../shared/utils';
import { CalendarsItemsService } from '../../item.utils.service';

const FORMAT_WITH_TIME = 'F j, Y h:i K';
const FORMAT_WITHOUT_TIME = 'F j, Y';

const COMMON_DATE_PICKER_OPTIONS = {
  // utc: true,
  altInput: true,
  enableTime: true,
  altFormat: FORMAT_WITH_TIME
};

@Component({
  selector: 'cp-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class CalendarsItemFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() calendarId: number;
  @Output() submitted: EventEmitter<any> = new EventEmitter();

  formError;
  mapCenter;
  buttonData;
  enddatePickerOpts;
  startdatePickerOpts;
  newAddress = new BehaviorSubject(null);

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public utils: CalendarsItemsService
  ) {}

  toggleDatePickerTime(checked) {
    const dateFormat = checked ? FORMAT_WITHOUT_TIME : FORMAT_WITH_TIME;

    this.startdatePickerOpts = {
      ...this.startdatePickerOpts,
      enableTime: !checked,
      dateFormat: dateFormat
    };

    this.enddatePickerOpts = {
      ...this.enddatePickerOpts,
      enableTime: !checked,
      dateFormat: dateFormat
    };
  }

  updateTime() {
    const startDateAtMidnight = CPDate.fromEpoch(
      this.form.controls['start'].value,
      this.session.tz
    ).startOf('day');

    const endDateAtMidnight = CPDate.fromEpoch(
      this.form.controls['end'].value,
      this.session.tz
    ).endOf('day');

    this.form.controls['start'].setValue(CPDate.toEpoch(startDateAtMidnight, this.session.tz));
    this.form.controls['end'].setValue(CPDate.toEpoch(endDateAtMidnight, this.session.tz));
  }

  onAllDayToggle(checked: boolean) {
    this.toggleDatePickerTime(checked);
    this.form.controls['is_all_day'].setValue(checked);
  }

  onResetMap() {
    const school = this.session.g.get('school');

    CPMap.setFormLocationData(this.form, CPMap.resetLocationFields(school));
    this.centerMap(school.latitude, school.longitude);
  }

  onMapSelection(data) {
    const cpMap = CPMap.getBaseMapObject(data);

    const location = { ...cpMap, address: data.formatted_address };

    CPMap.setFormLocationData(this.form, location);

    this.newAddress.next(this.form.controls['address'].value);
  }

  updateWithUserLocation(location) {
    location = Object.assign({}, location, { location: location.name });

    CPMap.setFormLocationData(this.form, location);

    this.centerMap(location.latitude, location.longitude);
  }

  onPlaceChange(data) {
    if (!data) {
      return;
    }

    if ('fromUsersLocations' in data) {
      this.updateWithUserLocation(data);

      return;
    }

    const cpMap = CPMap.getBaseMapObject(data);

    const location = { ...cpMap, address: data.name };
    const coords: google.maps.LatLngLiteral = data.geometry.location.toJSON();

    CPMap.setFormLocationData(this.form, location);

    /**
     * Calendar Items store the item's address
     * as location unlike other resources...
     */
    this.form.controls['location'].setValue(data.name);

    this.centerMap(coords.lat, coords.lng);
  }

  centerMap(lat: number, lng: number) {
    return this.mapCenter.next({ lat, lng });
  }

  enableButton() {
    this.buttonData = { ...this.buttonData, disabled: false };
  }

  ngOnInit() {
    const _self = this;

    this.mapCenter = new BehaviorSubject({
      lat: this.session.g.get('school').latitude,
      lng: this.session.g.get('school').longitude
    });

    this.startdatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: CPDate.fromEpoch(this.form.controls['start'].value, _self.session.tz).format(),
      onClose: function(_, dateStr) {
        _self.form.controls['start'].setValue(CPDate.toEpoch(dateStr, _self.session.tz));
      }
    };

    this.enddatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: CPDate.fromEpoch(this.form.controls['end'].value, _self.session.tz).format(),
      onClose: function(_, dateStr) {
        _self.form.controls['end'].setValue(CPDate.toEpoch(dateStr, _self.session.tz));
      }
    };

    const submitEdit = this.cpI18n.translate('save');
    const submitCreate = this.cpI18n.translate('calendars_form_submit_button_new');
    const isEditForm = this.form.controls['title'].value !== null;

    this.buttonData = {
      class: 'primary',
      text: isEditForm ? submitEdit : submitCreate
    };
  }

  onSubmit() {
    this.formError = false;

    const valid = this.utils.validate(this.form);
    if (!valid) {
      this.enableButton();
      this.formError = true;

      return;
    }

    if (this.form.controls['is_all_day'].value) {
      this.updateTime();
    }

    this.submitted.emit(this.form.value);
  }
}
