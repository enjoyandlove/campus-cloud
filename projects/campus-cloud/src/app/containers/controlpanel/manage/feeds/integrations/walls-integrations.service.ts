import { HttpParams } from '@angular/common/http';
import { map, startWith } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IItem } from '@campus-cloud/shared/components';
import { ApiService } from '@campus-cloud/base/services';
import { CPDropdownComponent } from '@campus-cloud/shared/components';
import { CPI18nService } from '@campus-cloud/shared/services/i18n.service';
import { ISocialPostCategory } from '../model/feeds.interfaces';
import { IWallsIntegration } from '@campus-cloud/libs/integrations/walls/model';

@Injectable()
export class WallsIntegrationsService {
  constructor(private api: ApiService, private cpI18n: CPI18nService) {}

  getIntegrations(startRage: number, endRage: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.WALLS_INTEGRATIONS}/${startRage};${endRage}`;

    return this.api.get(url, search, true);
  }

  createIntegration(body: IWallsIntegration, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.WALLS_INTEGRATIONS}/`;

    return this.api.post(url, body, search, true);
  }

  getSocialPostCategories(search: HttpParams): Observable<IItem[]> {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SOCIAL_POST_CATEGORY}`;
    const url = `${common}/1;10000`;

    return <Observable<IItem[]>>this.api.get(url, search).pipe(
      map(this.filterPostableCategories),
      map(this.socialPostCategoryToCPItem),
      map(this.addExtraItems.bind(this)),
      startWith([CPDropdownComponent.defaultPlaceHolder()])
    );
  }

  createSocialPostCategory(body: any, search: HttpParams): Observable<ISocialPostCategory> {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SOCIAL_POST_CATEGORY}/`;

    return <Observable<ISocialPostCategory>>this.api.post(url, body, search, true);
  }

  editIntegration(integrationId: number, body, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.WALLS_INTEGRATIONS}/${integrationId}`;

    return this.api.update(url, body, search, true);
  }

  deleteIntegration(integrationId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.WALLS_INTEGRATIONS}/${integrationId}`;

    return this.api.delete(url, search, true);
  }

  syncNow(integrationId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.WALLS_INTEGRATIONS}/${integrationId}`;

    return this.api.update(url, {}, search, true, 0);
  }

  private filterPostableCategories(categories: ISocialPostCategory[]): ISocialPostCategory[] {
    return categories.filter((c) => !c.is_postable);
  }

  private socialPostCategoryToCPItem(postableCategories: ISocialPostCategory[]): IItem[] {
    return postableCategories.map((c) => {
      return {
        action: c.id,
        label: c.name
      };
    });
  }

  private addExtraItems(socialPostCategories: IItem[]): IItem[] {
    const action = 'new_channel';
    const label = this.cpI18n.translate('t_walls_integrations_new_channel');
    const newChannel = { action, label };

    return [CPDropdownComponent.defaultPlaceHolder(), newChannel, ...socialPostCategories];
  }
}
