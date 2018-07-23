import { Injectable } from '@angular/core';
import * as moment from 'moment';

import {
  now,
  lastYear,
  last30Days,
  last90Days
} from '../../../../shared/components/cp-range-picker/cp-range-picker.utils.service';

import { CPSession } from '../../../../session';
import { AssessType } from './engagement.status';
import { CPI18nService } from '../../../../shared/services';

@Injectable()
export class EngagementUtilsService {
  constructor(public session: CPSession, public cpI18n: CPI18nService) {}

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
      _audiences.push({
        route_id: audience.name
          .toLowerCase()
          .split(' ')
          .join('_'),
        label: audience.name,
        listId: audience.id
      });
    });

    return [...heading, ..._audiences];
  }

  parsedPersona(personas) {
    const _persona = [];

    const heading = [
      {
        label: this.cpI18n.translate('t_notify_announcement_audiences_my_experiences'),
        value: null,
        heading: true
      }
    ];

    personas.forEach((persona) => {
      _persona.push({
        route_id: this.getLocalizedLabel(persona.localized_name_map)
          .toLowerCase()
          .split(' ')
          .join('_'),
        label: this.getLocalizedLabel(persona.localized_name_map),
        personaId: persona.id
      });
    });

    return [...heading, ..._persona];
  }

  dateFilter() {
    const todayDate = moment().endOf('day');

    return [
      {
        route_id: 'last_30_days',
        label: this.cpI18n.translate('assess_last_30_days'),
        payload: {
          metric: 'weekly',
          range: {
            end: now(this.session.tz),
            start: last30Days(this.session.tz, todayDate)
          }
        }
      },
      {
        route_id: 'last_90_days',
        label: this.cpI18n.translate('assess_last_90_days'),
        payload: {
          metric: 'monthly',
          range: {
            end: now(this.session.tz),
            start: last90Days(this.session.tz, todayDate)
          }
        }
      },
      {
        route_id: 'last_year',
        label: this.cpI18n.translate('assess_last_year'),
        payload: {
          metric: 'monthly',
          range: {
            end: now(this.session.tz),
            start: lastYear(this.session.tz, todayDate)
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
}
