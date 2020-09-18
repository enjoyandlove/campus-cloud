import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpParams } from '@angular/common/http';
import { CPSession } from '@campus-cloud/session';
import { AdminService, CPI18nService } from '@campus-cloud/shared/services';
import {
  CheckInMethod,
  EventAttendance,
  EventFeedback,
  SelfCheckInOption
} from '../../../event.status';
import { IMultiSelectItem } from '@campus-cloud/shared/components';
import { EventUtilService } from '@controlpanel/manage/events/events.utils.service';

@Component({
  selector: 'cp-events-assessment-form',
  templateUrl: './events-assessment-form.component.html',
  styleUrls: ['./events-assessment-form.component.scss']
})
export class EventsAssessmentFormComponent implements OnInit, OnDestroy {
  @Input() clubId;
  @Input() storeId;
  @Input() form: FormGroup;
  @Input() formError: boolean;
  @Input() isOrientation: boolean;
  @Input() changedHost$: BehaviorSubject<number> = new BehaviorSubject(null);

  selectedManager;
  originalAttnFeedback;
  selectedAttendanceType;
  attendanceFeedbackLabel;
  managers: Array<any> = [{ label: '---' }];
  attendanceEnabled = EventAttendance.enabled;
  eventFeedbackEnabled = EventFeedback.enabled;
  attendanceTypes = this.utils.getAttendanceTypeOptions();
  attendanceFeedback = this.utils.getAttendanceFeedback();
  selfCheckInMethods: IMultiSelectItem[];

  constructor(
    private session: CPSession,
    public cpI18n: CPI18nService,
    private utils: EventUtilService,
    public adminService: AdminService
  ) {}

  onSelectedManager(manager): void {
    this.form.controls['event_manager_id'].setValue(manager.value);
  }

  onSelectedAttendanceType(type): void {
    this.form.controls['has_checkout'].setValue(type.action);
  }

  fetchManagersBySelectedStore(storeId) {
    let search: HttpParams = new HttpParams()
      .append('school_id', this.session.g.get('school').id.toString())
      .append('privilege_type', this.utils.getPrivilegeType(this.isOrientation));

    if (!this.isOrientation) {
      search = search.append('store_id', storeId);
    }

    this.adminService
      .getAdminByStoreId(search)
      .pipe(
        map((managers) => EventUtilService.parseEventManagers(managers)),
        map((parsedManagers) => {
          this.managers = parsedManagers;
          this.selectedManager = parsedManagers.find(
            (manager) => manager.value === this.form.controls['event_manager_id'].value
          );
        })
      )
      .subscribe();
  }

  enableStudentFeedbackOnAttendanceToggle(value) {
    const attendanceLabel = value ? this.attendanceFeedbackLabel : '';

    this.form.controls['event_feedback'].setValue(value);
    this.form.controls['custom_basic_feedback_label'].setValue(attendanceLabel);
    this.originalAttnFeedback = EventUtilService.getFromArray(
      this.attendanceFeedback,
      'action',
      value
    );
  }

  toggleEventAttendance(value) {
    value = value ? EventAttendance.enabled : EventAttendance.disabled;

    this.enableStudentFeedbackOnAttendanceToggle(value);
    this.form.controls['event_attendance'].setValue(value);
    this.form.controls['attend_verification_methods'].setValue([
      CheckInMethod.web,
      CheckInMethod.deepLink,
      CheckInMethod.app,
      CheckInMethod.userWebEntry
    ]);
    this.setSelfCheckInMethods(this.form.controls['attend_verification_methods'].value);
  }

  onEventFeedbackChange(option) {
    const feedbackQuestion = !option.action
      ? ''
      : this.cpI18n.translate('t_events_default_feedback_question');

    this.form.controls['event_feedback'].setValue(option.action);
    this.form.controls['custom_basic_feedback_label'].setValue(feedbackQuestion);
  }

  initialize() {
    const event = this.form.value;
    this.attendanceFeedbackLabel = event.custom_basic_feedback_label
      ? event.custom_basic_feedback_label
      : this.cpI18n.translate('t_events_default_feedback_question');

    if (event.store_id) {
      this.fetchManagersBySelectedStore(event.store_id);
    } else if (this.storeId) {
      this.fetchManagersBySelectedStore(this.storeId);
    } else if (this.clubId) {
      this.fetchManagersBySelectedStore(this.clubId);
    } else if (this.isOrientation) {
      this.fetchManagersBySelectedStore(null);
    } else if (this.session.defaultHost) {
      this.fetchManagersBySelectedStore(this.session.defaultHost.value);
    }

    this.originalAttnFeedback = EventUtilService.getFromArray(
      this.utils.getAttendanceFeedback(),
      'action',
      event.event_feedback
    );

    this.selectedAttendanceType = EventUtilService.getFromArray(
      this.utils.getAttendanceTypeOptions(),
      'action',
      event.has_checkout
    );

    this.setSelfCheckInMethods(event.attend_verification_methods);
  }

  private setSelfCheckInMethods(attend_verification_methods) {
    if (!attend_verification_methods) {
      return;
    }
    this.selfCheckInMethods = this.utils.getSelfCheckInMethods().map((option) => {
      return {
        ...option,
        selected: EventUtilService.getSelfCheckInStatus(attend_verification_methods, option.action)
      };
    });
  }

  ngOnInit() {
    this.initialize();

    this.changedHost$.subscribe((storeId) => {
      this.selectedManager = null;
      this.fetchManagersBySelectedStore(storeId);
    });
  }

  ngOnDestroy() {
    this.changedHost$.unsubscribe();
  }

  onSelectedCheckInMethods(options: number[]) {
    this.form.controls['attend_verification_methods'].setValue([CheckInMethod.web]);
    const verificationMethods = this.form.controls['attend_verification_methods'].value;

    options.forEach((option) => {
      if (option === SelfCheckInOption.qr && !verificationMethods.includes(CheckInMethod.app)) {
        verificationMethods.push(CheckInMethod.app);
      } else if (
        option === SelfCheckInOption.email &&
        !verificationMethods.includes(CheckInMethod.userWebEntry)
      ) {
        verificationMethods.push(CheckInMethod.userWebEntry);
      } else if (
        option === SelfCheckInOption.appLink &&
        !verificationMethods.includes(CheckInMethod.deepLink)
      ) {
        verificationMethods.push(CheckInMethod.deepLink);
      }
    });
  }
}
