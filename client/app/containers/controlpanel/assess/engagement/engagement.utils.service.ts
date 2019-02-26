import { HttpParams } from '@angular/common/http';
import { map, startWith } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { CPSession } from '@app/session';
import { DEFAULT } from '@shared/constants';
import { CPI18nService } from '@shared/services';
import { EngagementService } from './engagement.service';
import { AudienceType } from '../../audience/audience.status';
import { amplitudeEvents } from '@shared/constants/analytics';
import * as DATE_RANGE from '@shared/components/cp-range-picker';
import { AssessType, FilterType, PersonaType } from './engagement.status';

export interface IStudentFilter {
  label: string;
  route_id: string;
  cohort_type: string;
  listId?: number;
  personaId?: number;
}

export interface IDateFilter {
  route_id: string;
  label: string;
  payload: {
    metric: string;
    range: {
      end: number;
      start: number;
    };
  };
}

export const AMPLITUDE_INTERVAL_MAP = {
  last_30_days: amplitudeEvents.LAST_30_DAYS,
  last_90_days: amplitudeEvents.LAST_90_DAYS,
  last_year: amplitudeEvents.LAST_YEAR,
  [DEFAULT]: amplitudeEvents.CUSTOM
};

@Injectable()
export class EngagementUtilsService {
  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    private engageService: EngagementService
  ) {}

  getFromArray(arr: Array<any>, key: string, val: number) {
    return arr.filter((item) => item[key] === val)[0];
  }

  getLocalizedLabel(label) {
    return CPI18nService.getLocale().startsWith('fr') ? label.fr : label.en;
  }

  getRange(routeParams) {
    const range = this.getFromArray(this.dateFilter(), 'route_id', routeParams.range);

    return range
      ? range
      : {
          payload: this.setDateRange(routeParams),
          label: routeParams.range,
          route_id: routeParams.range
        };
  }

  setDateRange(filter) {
    return {
      range: {
        start: filter.start,
        end: filter.end
      }
    };
  }

  parsedServices(services) {
    const _services = [];

    const heading = [
      {
        label: this.cpI18n.translate('services'),
        value: null,
        heading: true
      }
    ];

    services.forEach((service) => {
      _services.push({
        route_id: service.name
          .toLowerCase()
          .split(' ')
          .join('_'),
        label: service.name,
        data: {
          type: 'services',
          value: service.id,
          queryParam: 'service_id'
        }
      });
    });

    return [...heading, ..._services];
  }

  parsedAudiences(audiences) {
    const _audiences = [];

    const heading = [
      {
        label: this.cpI18n.translate('audience_my_audiences'),
        value: null,
        heading: true
      }
    ];

    audiences.forEach((audience) => {
      const cohort_type =
        audience.type === AudienceType.custom
          ? amplitudeEvents.CUSTOM_AUDIENCE
          : amplitudeEvents.DYNAMIC_AUDIENCE;

      _audiences.push({
        route_id: audience.name
          .toLowerCase()
          .split(' ')
          .join('_'),
        cohort_type,
        label: audience.name,
        listId: audience.id
      });
    });

    return [...heading, ..._audiences];
  }

  parsedPersona(personas) {
    const _persona = [];

    const heading = {
      label: this.cpI18n.translate('t_notify_announcement_audiences_my_experiences'),
      value: null,
      heading: true
    };

    personas.forEach((persona) => {
      _persona.push({
        route_id: this.getLocalizedLabel(persona.localized_name_map)
          .toLowerCase()
          .split(' ')
          .join('_'),
        label: this.getLocalizedLabel(persona.localized_name_map),
        personaId: persona.id,
        cohort_type: amplitudeEvents.EXPERIENCE
      });
    });

    if (_persona.length) {
      _persona.unshift(heading);
    }

    return _persona;
  }

  dateFilter(): IDateFilter[] {
    const todayDate = moment().endOf('day');

    return [
      {
        route_id: 'last_30_days',
        label: this.cpI18n.translate('assess_last_30_days'),
        payload: {
          metric: 'weekly',
          range: {
            end: DATE_RANGE.now(this.session.tz),
            start: DATE_RANGE.last30Days(this.session.tz, todayDate)
          }
        }
      },
      {
        route_id: 'last_90_days',
        label: this.cpI18n.translate('assess_last_90_days'),
        payload: {
          metric: 'monthly',
          range: {
            end: DATE_RANGE.now(this.session.tz),
            start: DATE_RANGE.last90Days(this.session.tz, todayDate)
          }
        }
      },
      {
        route_id: 'last_year',
        label: this.cpI18n.translate('assess_last_year'),
        payload: {
          metric: 'monthly',
          range: {
            end: DATE_RANGE.now(this.session.tz),
            start: DATE_RANGE.lastYear(this.session.tz, todayDate)
          }
        }
      }
    ];
  }

  commonEngagementFilter() {
    return [
      {
        route_id: 'all',
        label: this.cpI18n.translate('assess_all_engagements'),
        data: {
          type: null,
          value: AssessType.Engagements,
          queryParam: 'scope'
        }
      },
      {
        route_id: 'all_services',
        label: this.cpI18n.translate('assess_all_services'),
        data: {
          type: 'services',
          value: AssessType.Services,
          queryParam: 'scope'
        }
      },
      {
        route_id: 'all_events',
        label: this.cpI18n.translate('assess_all_events'),
        data: {
          type: 'events',
          value: AssessType.Events,
          queryParam: 'scope'
        }
      },
      {
        route_id: 'all_orientations',
        label: this.cpI18n.translate('t_assess_all_orientations'),
        data: {
          type: 'orientations',
          value: AssessType.Orientation,
          queryParam: 'scope'
        }
      }
    ];
  }

  commonStudentFilter() {
    return [
      {
        route_id: 'all_students',
        label: this.cpI18n.translate('assess_all_students'),
        listId: null
      }
    ];
  }

  getStudentFilter(): Observable<any[]> {
    const schoolSearch = this.session.addSchoolId(new HttpParams());
    const personaSearch = schoolSearch.set('platform', PersonaType.app.toString());
    const audienceSearch = schoolSearch;
    return forkJoin(
      this.engageService.getPersona(undefined, undefined, personaSearch),
      this.engageService.getLists(undefined, undefined, audienceSearch)
    ).pipe(
      map((res) => {
        return [
          ...this.commonStudentFilter(),
          ...this.parsedPersona(res[0]),
          ...this.parsedAudiences(res[1])
        ];
      }),
      startWith(this.commonStudentFilter())
    );
  }

  resourceSortingFilter() {
    return [
      {
        label: this.cpI18n.translate('attendees'),
        action: FilterType.attendees
      },
      {
        label: this.cpI18n.translate('feedback'),
        action: FilterType.feedback
      },
      {
        label: this.cpI18n.translate('ratings'),
        action: FilterType.rating
      }
    ];
  }
}
