import { Injectable } from '@angular/core';

import { CPI18nService } from '../../../shared/services';
import { amplitudeEvents } from '../../../shared/constants/analytics';
import { CheckInMethod, EventCategory } from '../../controlpanel/manage/events/event.status';

export enum ErrorCode {
  notFound = 404,
  forbidden = 403,
  badRequest = 400
}

@Injectable()
export class CheckinUtilsService {
  constructor(public cpI18n: CPI18nService) {}

  getErrorMessage(status) {
    let errorMessage = this.cpI18n.translate('something_went_wrong');

    if (status === ErrorCode.notFound) {
      errorMessage = this.cpI18n.translate('t_external_check_in_not_found_error');
    } else if (status === ErrorCode.forbidden) {
      errorMessage = this.cpI18n.translate('t_external_check_in_forbidden_error');
    } else if (status === ErrorCode.badRequest) {
      errorMessage = this.cpI18n.translate('t_external_check_in_bad_request_error');
    }

    return errorMessage;
  }

  getCheckInSource(category: Number) {
    if (category === EventCategory.club) {
      return amplitudeEvents.CLUB_EVENT;
    } else if (category === EventCategory.services) {
      return amplitudeEvents.SERVICE_EVENT;
    } else if (category === EventCategory.athletics) {
      return amplitudeEvents.ATHLETIC_EVENT;
    } else {
      return amplitudeEvents.ORIENTATION_EVENT;
    }
  }

  getCheckedInEventProperties(source_id, events, isEvent = false) {
    const verificationMethod = isEvent
      ? events['attend_verification_methods']
      : events['checkin_verification_methods'];

    const assessment_type = isEvent
      ? this.getCheckInSource(events['store_category'])
      : amplitudeEvents.SERVICE_PROVIDER;

    const check_out_status = events['has_checkout']
      ? amplitudeEvents.ENABLED
      : amplitudeEvents.DISABLED;

    const qr_code_status = verificationMethod.includes(CheckInMethod.app)
      ? amplitudeEvents.ENABLED
      : amplitudeEvents.DISABLED;

    return {
      source_id,
      assessment_type,
      qr_code_status,
      check_out_status
    };
  }
}
