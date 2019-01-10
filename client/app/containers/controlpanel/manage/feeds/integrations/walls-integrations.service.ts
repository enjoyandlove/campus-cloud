import { HttpClient, HttpParams } from '@angular/common/http';
import { map, startWith } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { API } from '@app/config/api';
import { HTTPService } from '@app/base/http.service';
import { IItem } from '@client/app/shared/components';
import { CPDropdownComponent } from '@shared/components';
import { CPI18nService } from '@shared/services/i18n.service';
import { ISocialPostCategory } from './../model/feeds.interfaces';
import { IWallsIntegration } from '@client/app/libs/integrations/walls/model';

@Injectable()
export class WallsIntegrationsService extends HTTPService {
  constructor(http: HttpClient, router: Router, private cpI18n: CPI18nService) {
    super(http, router);

    Object.setPrototypeOf(this, WallsIntegrationsService.prototype);
  }

  getIntegrations(startRage: number, endRage: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.WALLS_INTEGRATIONS
    }/${startRage};${endRage}`;

    return super.get(url, search, true);
  }

  createIntegration(body: IWallsIntegration, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.WALLS_INTEGRATIONS}/`;

    return super.post(url, body, search, true);
  }

  getSocialPostCategories(search: HttpParams): Observable<IItem[]> {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SOCIAL_POST_CATEGORY}`;
    const url = `${common}/1;10000`;

    return <Observable<IItem[]>>super
      .get(url, search)
      .pipe(
        map(this.filterPostableCategories),
        map(this.socialPostCategoryToCPItem),
        map(this.addExtraItems.bind(this)),
        startWith([CPDropdownComponent.defaultPlaceHolder()])
      );
  }

  createSocialPostCategory(body: any, search: HttpParams): Observable<ISocialPostCategory> {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SOCIAL_POST_CATEGORY}/`;

    return <Observable<ISocialPostCategory>>super.post(url, body, search, true);
  }

  editIntegration(integrationId: number, body, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.WALLS_INTEGRATIONS
    }/${integrationId}`;

    return super.update(url, body, search, true);
  }

  deleteIntegration(integrationId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.WALLS_INTEGRATIONS
    }/${integrationId}`;

    return super.delete(url, search, true);
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
