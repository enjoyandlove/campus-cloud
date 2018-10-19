import { Injectable } from '@angular/core';

import { CPI18nService } from '../../../shared/services';
import { amplitudeEvents } from '../../../shared/constants/analytics';
import { CheckInMethod, CheckInSource } from '../../controlpanel/manage/events/event.status';

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

  getCheckInSource(source: string) {
    if (source === CheckInSource.events) {
      return amplitudeEvents.INSTITUTION_EVENT;

    } else if (source === CheckInSource.club) {
      return amplitudeEvents.CLUB_EVENT;

    } else if (source === CheckInSource.orientation) {
      return amplitudeEvents.ORIENTATION_EVENT;

    } else if (source === CheckInSource.services) {
      return amplitudeEvents.SERVICE_EVENT;

    } else if (source === CheckInSource.athletics) {
      return amplitudeEvents.ATHLETIC_EVENT;
    }
  }

  getCheckedInEventProperties(source_id, events, user_id, checkInSource, isEvent = false) {
    const verificationMethod = isEvent
      ? events['attend_verification_methods']
      : events['checkin_verification_methods'];

    const check_in_type = isEvent
      ? this.getCheckInSource(checkInSource)
      : amplitudeEvents.SERVICE_PROVIDER;

    const check_out_status = events['has_checkout']
      ? amplitudeEvents.ENABLED
      : amplitudeEvents.DISABLED;

    const qr_code_status = verificationMethod.includes(CheckInMethod.app)
        ? amplitudeEvents.ENABLED
        : amplitudeEvents.DISABLED;

    const access_type = checkInSource
      ? amplitudeEvents.CLICKED_CHECK_IN
      : amplitudeEvents.LOADED_CHECK_IN;

    return {
      user_id,
      source_id,
      access_type,
      check_in_type,
      qr_code_status,
      check_out_status
    };
  }
}
