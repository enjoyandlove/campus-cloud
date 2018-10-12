import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  HasData,
  Assessment,
  serviceFeedback,
  ServiceAttendance
} from './services.status';

import {
  canSchoolReadResource,
  canStoreReadAndWriteResource
} from '../../../../shared/utils/privileges';

import { CPSession } from '../../../../session';
import IServiceProvider from './providers.interface';
import { Formats } from '../../../../shared/utils/csv';
import { CPDate } from '../../../../shared/utils/date/date';
import { CPI18nService } from '../../../../shared/services';
import { CP_PRIVILEGES_MAP } from '../../../../shared/constants';
import { createSpreadSheet } from '../../../../shared/utils/csv/parser';
import { HEADER_UPDATE, IHeader } from '../../../../reducers/header.reducer';
import { attendanceType, CheckInMethod, CheckInOutTime } from '../events/event.status';

@Injectable()
export class ServicesUtilsService {
  constructor(
    public fb: FormBuilder,
    public session: CPSession,
    public store: Store<IHeader>,
    public cpI18n: CPI18nService
  ) {}

  hasData(data) {
    return data ? HasData.yes : HasData.no;
  }

  getAssessmentStatus(assessment) {
    return assessment === ServiceAttendance.enabled ? Assessment.on : Assessment.off;
  }

  customValidator(controls: FormGroup): ValidationErrors | null {
    const hasFeedback = controls.get('has_feedback').value;
    const feedbackLabel = controls.get('custom_basic_feedback_label').value;

    if (hasFeedback) {
      return  feedbackLabel ? null : { feedbackLabelRequired: true };
    }
  }

  getAttendanceFeedback() {
    return [
      {
        label: this.cpI18n.translate('t_service_provider_feedback_yes'),
        action: serviceFeedback.enabled
      },
      {
        label: this.cpI18n.translate('no'),
        action: serviceFeedback.disabled
      },
    ];
  }

  setEventProperties(data, service_id) {
    return {
      service_id,
      email: this.hasData(data.email),
      phone: this.hasData(data.contactphone),
      website: this.hasData(data.website),
      location: this.hasData(data.location),
      assessment: this.getAssessmentStatus(data.service_attendance)
    };
  }

  getProviderForm(formData: IServiceProvider) {
    const verificationMethods = formData
      ? formData.checkin_verification_methods
      : [CheckInMethod.web, CheckInMethod.webQr, CheckInMethod.app];

    return this.fb.group(
      {
        checkin_verification_methods: [verificationMethods],
        email: [formData ? formData.email : null, Validators.required],
        custom_basic_feedback_label: [this.getCustomFeedbackLabel(formData)],
        has_feedback: [formData ? formData.has_feedback : serviceFeedback.enabled],
        has_checkout: [formData ? formData.has_checkout : attendanceType.checkInOnly],
        provider_name: [formData ? formData.provider_name : null, Validators.required]
      },
      { validator: this.customValidator }
    );
  }

  getCustomFeedbackLabel(formData: IServiceProvider) {
    return formData ? formData.custom_basic_feedback_label
      ? formData.custom_basic_feedback_label : null
      : this.cpI18n.translate('t_events_default_feedback_question');
  }

  exportServiceProvidersAttendees(assessments) {
    const columns = [
      this.cpI18n.translate('t_service_provider_csv_column_provider_name'),
      this.cpI18n.translate('t_service_provider_csv_column_first_name'),
      this.cpI18n.translate('t_service_provider_csv_column_last_name'),
      this.cpI18n.translate('email'),
      this.cpI18n.translate('services_label_checked_in_method'),
      this.cpI18n.translate('t_service_provider_csv_column_check_in_date'),
      this.cpI18n.translate('t_service_provider_csv_column_time_in'),
      this.cpI18n.translate('t_service_provider_csv_column_check_out_date'),
      this.cpI18n.translate('t_service_provider_csv_column_time_out'),
      this.cpI18n.translate('t_service_provider_csv_column_time_spent'),
      this.cpI18n.translate('t_service_provider_csv_column_time_spent_seconds'),
      this.cpI18n.translate('t_service_provider_csv_column_ratings'),
      this.cpI18n.translate('feedback'),
      this.cpI18n.translate('student_id')
    ];

    const check_in_method = {
      1: 'Web check-in',
      3: 'App check-in'
    };

    assessments = assessments.map((item) => {
      const timeSpentSeconds = item.check_out_time_epoch - item.check_in_time;
      const hasCheckOutTimeSpent =
        item.check_out_time_epoch &&
        item.service_provider_has_checkout &&
        item.check_out_time_epoch !== CheckInOutTime.empty;

      return {
        [this.cpI18n.translate('t_service_provider_csv_column_provider_name')]:
        item.service_provider_name,

        [this.cpI18n.translate('t_service_provider_csv_column_first_name')]: item.firstname,

        [this.cpI18n.translate('t_service_provider_csv_column_last_name')]: item.lastname,

        [this.cpI18n.translate('email')]: item.email,

        [this.cpI18n.translate('services_label_checked_in_method')]
          : check_in_method[item.check_in_method],

        [this.cpI18n.translate('t_service_provider_csv_column_check_in_date')]: CPDate.fromEpoch(
          item.check_in_time,
          this.session.tz
        ).format(Formats.dateFormat),

        [this.cpI18n.translate('t_service_provider_csv_column_time_in')]: CPDate.fromEpoch(
          item.check_in_time,
          this.session.tz
        ).format(Formats.timeFormatLong),

        [this.cpI18n.translate(
          't_service_provider_csv_column_check_out_date'
        )]: hasCheckOutTimeSpent
          ? CPDate.fromEpoch(item.check_out_time_epoch, this.session.tz).format(Formats.dateFormat)
          : '',

        [this.cpI18n.translate('t_service_provider_csv_column_time_out')]: hasCheckOutTimeSpent
          ? CPDate.fromEpoch(item.check_out_time_epoch, this.session.tz)
            .format(Formats.timeFormatLong) : '',

        [this.cpI18n.translate('t_service_provider_csv_column_time_spent')]: hasCheckOutTimeSpent
          ? CPDate.getTimeDuration(timeSpentSeconds)
            .format(Formats.timeDurationFormat, {trim: false, useGrouping: false}) : '',

        [this.cpI18n.translate(
          't_service_provider_csv_column_time_spent_seconds'
        )]: hasCheckOutTimeSpent ? timeSpentSeconds : '',

        [this.cpI18n.translate('t_service_provider_csv_column_ratings')]:
          item.feedback_rating === -1 ? 'N/A' : item.feedback_rating / 100 * 5,

        [this.cpI18n.translate('feedback')]: item.feedback_text,

        [this.cpI18n.translate('student_id')]: item.student_identifier
      };
    });

    createSpreadSheet(assessments, columns);
  }

  buildServiceProviderHeader(service) {
    let children = [
      {
        label: 'info',
        url: `/manage/services/${service.id}/info`
      }
    ];

    const eventsSchoolLevel = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.events);
    const eventsAccountLevel = canStoreReadAndWriteResource(
      this.session.g,
      service.store_id,
      CP_PRIVILEGES_MAP.events
    );

    if (eventsSchoolLevel || eventsAccountLevel) {
      const events = {
        label: 'events',
        url: `/manage/services/${service.id}/events`
      };

      children = [...children, events];
    }

    if (service.service_attendance) {
      const attendance = {
        label: 'assessment',
        url: `/manage/services/${service.id}`
      };

      children = [...children, attendance];
    }

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: `[NOTRANSLATE]${service.name}[NOTRANSLATE]`,
        subheading: '',
        crumbs: {
          url: 'services',
          label: 'services'
        },
        children: [...children]
      }
    });
  }
}
