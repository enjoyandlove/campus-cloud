import { combineLatest, of as observableOf, Observable, of } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CPI18nService } from './i18n.service';
import { CP_PRIVILEGES_MAP } from '../constants';
import { CPSession } from '@campus-cloud/session';
import { amplitudeEvents } from '../constants/analytics';
import { ApiService } from '@campus-cloud/base/services';
import { ClubStatus } from '@controlpanel/manage/clubs/club.status';
import { isClubAthletic } from '@controlpanel/manage/clubs/clubs.athletics.labels';
import { canAccountLevelReadResource, canSchoolReadResource } from '../utils/privileges';

const cpI18n = new CPI18nService();

export interface IStore {
  label: string;
  value: number | null;
  heading?: boolean;
  hostType?: string;
}

@Injectable()
export class StoreService {
  constructor(private api: ApiService, public session: CPSession) {}

  private getServices(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICES}/1;1000`;

    const placeHolder = [
      {
        label: cpI18n.translate('services'),
        value: null,
        heading: true
      }
    ];

    return this.api.get(url, search).pipe(
      startWith(placeHolder),
      map((res: any[]) => {
        const services = [
          {
            label: cpI18n.translate('services'),
            value: null,
            heading: true
          }
        ];

        const _services = res.map((store: any) => {
          return {
            label: store.name,
            value: store.store_id,
            heading: false,
            hostType: amplitudeEvents.SERVICE
          };
        });

        if (_services.length) {
          services.push(..._services);
        }

        return services.length === 1 ? [] : services;
      }),
      catchError(() => of(placeHolder))
    );
  }

  private getAthletics(search: HttpParams) {
    const ACTIVE_CLUBS = ClubStatus.active.toString();
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CLUBS}/1;1000`;

    search = search
      .append('category_id', isClubAthletic.athletic.toString())
      .append('status', ACTIVE_CLUBS);

    const placeHolder = [
      {
        label: cpI18n.translate('athletics'),
        value: null,
        heading: true
      }
    ];

    return this.api.get(url, search).pipe(
      startWith(placeHolder),
      map((res: any[]) => {
        const athletics = [
          {
            label: cpI18n.translate('athletics'),
            value: null,
            heading: true
          }
        ];

        const _athletics = res.map((store: any) => {
          return {
            label: store.name,
            value: store.id,
            heading: false,
            hostType: amplitudeEvents.ATHLETICS
          };
        });

        if (_athletics.length) {
          athletics.push(..._athletics);
        }

        return athletics.length === 1 ? [] : athletics;
      }),
      catchError(() => of(placeHolder))
    );
  }

  private getClubs(search: HttpParams) {
    const ACTIVE_CLUBS = ClubStatus.active.toString();
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CLUBS}/1;1000`;

    search = search.append('status', ACTIVE_CLUBS);

    const placeHolder = [
      {
        label: cpI18n.translate('clubs'),
        value: null,
        heading: true
      }
    ];

    return this.api.get(url, search).pipe(
      startWith(placeHolder),
      map((res: any[]) => {
        const clubs = [
          {
            label: cpI18n.translate('clubs'),
            value: null,
            heading: true
          }
        ];

        const _clubs = res.map((store: any) => {
          return {
            label: store.name,
            value: store.id,
            heading: false,
            hostType: amplitudeEvents.CLUB
          };
        });

        if (_clubs.length) {
          clubs.push(..._clubs);
        }

        return clubs.length === 1 ? [] : clubs;
      }),
      catchError(() => of(placeHolder))
    );
  }

  getStores(
    search: HttpParams,
    placeHolder: IStore = {
      label: cpI18n.translate('select_host'),
      value: null,
      heading: false
    }
  ): Observable<IStore[]> {
    /**
     * Check for user privileges before masking the call
     * to Stores/Clubs to avoid errors in Sentry
     */
    const clubsSchoolAccess = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.clubs);
    const clubsAccountAccess = canAccountLevelReadResource(this.session.g, CP_PRIVILEGES_MAP.clubs);
    const canReadClubs = clubsSchoolAccess || clubsAccountAccess;

    const athleticsSchoolAccess = canSchoolReadResource(
      this.session.g,
      CP_PRIVILEGES_MAP.athletics
    );
    const athleticsAccountAccess = canAccountLevelReadResource(
      this.session.g,
      CP_PRIVILEGES_MAP.athletics
    );

    const canReadAthletics = athleticsSchoolAccess || athleticsAccountAccess;

    const servicesSchoolAccess = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.services);
    const servicesAccountAccess = canAccountLevelReadResource(
      this.session.g,
      CP_PRIVILEGES_MAP.services
    );
    const canReadServices = servicesSchoolAccess || servicesAccountAccess;

    const clubs$ = canReadClubs ? this.getClubs(search) : observableOf([]);

    const athletics$ = canReadAthletics ? this.getAthletics(search) : observableOf([]);

    const services$ = canReadServices ? this.getServices(search) : observableOf([]);

    const stream$ = combineLatest([services$, clubs$, athletics$]);

    return stream$.pipe(
      map((res) => {
        if (!res[0].length && !res[1].length && !res[2].length) {
          return [
            {
              value: null,
              label: cpI18n.translate('select_host')
            }
          ];
        }

        return [placeHolder, ...res[0], ...res[1], ...res[2]];
      })
    );
  }

  getStoreById(storeId: number) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.STORE}/${storeId}`;

    return this.api.get(url);
  }
}
