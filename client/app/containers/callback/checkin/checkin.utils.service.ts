import { Injectable } from '@angular/core';

import { CPI18nService } from '../../../shared/services';
import { amplitudeEvents } from '../../../shared/constants/analytics';
import { CheckInSource } from '../../controlpanel/manage/events/event.status';

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
}
