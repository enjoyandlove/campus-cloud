import { Injectable } from '@angular/core';

import { CPI18nService } from '@campus-cloud/shared/services';
import { IItem } from '@campus-cloud/shared/components/cp-dropdown';
import { FeedIntegration } from './../model/integration.model';
import { parseErrorResponse } from '@projects/campus-cloud/src/app/shared/utils/http';

export enum ReponseErrors {
  'duplicate_feed_url_in_school' = 'duplicate feed_url in school'
}

export const RSS_ITEM: IItem = {
  action: FeedIntegration.types.rss,
  label: 'RSS'
};

export const ATOM_ITEM: IItem = {
  action: FeedIntegration.types.atom,
  label: 'Atom'
};

export const ICAL_ITEM: IItem = {
  action: FeedIntegration.types.ical,
  label: 'iCal'
};

@Injectable()
export class CommonIntegrationUtilsService {
  constructor(private cpI18n: CPI18nService) {}

  static typesDropdown(): IItem[] {
    return [RSS_ITEM, ATOM_ITEM, ICAL_ITEM];
  }

  static getSelectedType(typeAction: number) {
    return this.typesDropdown().find((d) => d.action === typeAction);
  }

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
