import { Injectable } from '@angular/core';

import { CPI18nService } from '@app/shared/services';
import { parseErrorResponse } from '@client/app/shared/utils/http';

enum ReponseErrors {
  'duplicate_feed_url_in_school' = 'duplicate feed_url in school'
}

@Injectable()
export class LibsIntegrationEventCommonUtilsService {
  constructor(private cpI18n: CPI18nService) {}

  handleCreateUpdateError(error: any): { error: string } {
    const errorMessage = parseErrorResponse(error);
    const defaultError = this.cpI18n.translate('something_went_wrong');
    const duplicateFeedError = this.cpI18n.translate(
      't_shared_integration_create_error_duplicate_feed_url'
    );

    const isDuplicateFeed = errorMessage === ReponseErrors.duplicate_feed_url_in_school;

    return {
      error: isDuplicateFeed ? duplicateFeedError : defaultError
    };
  }
}
