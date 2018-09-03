import { Injectable } from '@angular/core';

import { CPI18nService } from '../../../shared/services';

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
}
