import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  HasData,
  Feedback,
  Assessment,
  ServiceFeedback,
  ServiceAttendance
} from './services.status';

import {
  canSchoolReadResource,
  canStoreReadAndWriteResource
} from '../../../../shared/utils/privileges';

import { CPSession } from '../../../../session';
import { CPDate } from '../../../../shared/utils/date/date';
import { CPI18nService } from '../../../../shared/services';
import { CP_PRIVILEGES_MAP } from '../../../../shared/constants';
import { createSpreadSheet } from '../../../../shared/utils/csv/parser';
import { HEADER_UPDATE, IHeader } from '../../../../reducers/header.reducer';

@Injectable()
export class ServicesUtilsService {
  constructor(
    public session: CPSession,
    public store: Store<IHeader>,
    public cpI18n: CPI18nService
  ) {}

  hasData(data) {
    return data ? HasData.yes : HasData.no;
  }

  getFeedbackStatus(feedback) {
    return feedback === ServiceFeedback.enabled ? Feedback.enabled : Feedback.disabled;
  }

  getAssessmentStatus(assessment) {
    return assessment === ServiceAttendance.enabled ? Assessment.on : Assessment.off;
  }

  setEventProperties(data, service_id) {
    return {
      service_id,
      email: this.hasData(data.email),
      phone: this.hasData(data.contactphone),
      website: this.hasData(data.website),
      location: this.hasData(data.location),
      feedback: this.getFeedbackStatus(data.enable_feedback),
      assessment: this.getAssessmentStatus(data.service_attendance)
    };
  }

  exportServiceProviders(providers) {
    const columns = [
      this.cpI18n.translate('service_provider'),
      this.cpI18n.translate('email'),
      this.cpI18n.translate('average_rating'),
      this.cpI18n.translate('total_ratings'),
      this.cpI18n.translate('services_total_visits')
    ];

    providers = providers.map((data) => {
      return {
        [this.cpI18n.translate('service_provider')]: data.provider_name,

        [this.cpI18n.translate('email')]: data.email,

        [this.cpI18n.translate('average_rating')]: (
          data.avg_rating_percent *
          5 /
          100
        ).toFixed(1),

        [this.cpI18n.translate('total_ratings')]: data.num_ratings,

        [this.cpI18n.translate('services_total_visits')]: data.total_visits
      };
    });

    createSpreadSheet(providers, columns, 'providers_data');
  }

  exportServiceProvidersAttendees(assessments) {
      const columns = [
        this.cpI18n.translate('services_label_attendee_name'),
        this.cpI18n.translate('email'),
        this.cpI18n.translate('average_rating'),
        this.cpI18n.translate('feedback'),
        this.cpI18n.translate('services_label_checked_in_method'),
        this.cpI18n.translate('services_label_checked_in_time'),
        this.cpI18n.translate('student_id')
      ];

      const check_in_method = {
        1: 'Web check-in',
        3: 'App check-in'
      };

      assessments = assessments.map((item) => {
        return {
          [this.cpI18n.translate('services_label_attendee_name')]: `${item.firstname} ${
            item.lastname
            }`,

          [this.cpI18n.translate('email')]: item.email,

          [this.cpI18n.translate('average_rating')]:
            item.feedback_rating === -1 ? 'N/A' : item.feedback_rating / 100 * 5,

          [this.cpI18n.translate('feedback')]: item.feedback_text,

          [this.cpI18n.translate('services_label_checked_in_method')]: check_in_method[
            item.check_in_method
            ],

          [this.cpI18n.translate('services_label_checked_in_time')]: CPDate.fromEpoch(
            item.check_in_time,
            this.session.tz
          ).format('MMMM Do YYYY - h:mm a'),

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
