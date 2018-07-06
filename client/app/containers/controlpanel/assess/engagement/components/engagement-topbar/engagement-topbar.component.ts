import { OnInit, Output, Component, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { CPSession } from '../../../../../../session';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';
import {
  now,
  lastYear,
  last30Days,
  last90Days
} from '../../../../../../shared/components/cp-range-picker/cp-range-picker.utils.service';
import * as moment from 'moment';

interface IState {
  engagement: {
    label: string;
    data: {
      type: string;
      value: number;
    };
  };

  for: {
    label: string;
    listId: number;
  };

  range: {
    label: string;
    payload: {
      metric: string;
      range: {
        start: number;
        end: number;
      };
    };
  };
}

@Component({
  selector: 'cp-engagement-topbar',
  templateUrl: './engagement-topbar.component.html',
  styleUrls: ['./engagement-topbar.component.scss']
})
export class EngagementTopBarComponent implements OnInit {
  @Output() doFilter: EventEmitter<IState> = new EventEmitter();
  @Output() download: EventEmitter<boolean> = new EventEmitter();

  engageMentFilter;

  hasRouteData;

  commonStudentFilter;

  commonEngageMentFilter;

  datePickerClass = 'cancel';

  icon = 'keyboard_arrow_down';

  dateFilter;

  state: IState;

  studentFilter;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    private route: ActivatedRoute
  ) {}

  onDateRangeChange(payload) {
    this.updateState('range', this.setPayload(payload));
  }

  onScopeChange(payload) {
    this.updateState('engagement', payload);
  }

  onStudentChange(payload) {
    this.updateState('for', payload);
  }

  setPayload(payload) {
    if (!payload.hasOwnProperty('payload')) {
       return {
         payload: this.setDateRange(payload),
         label: payload.label,
         route_id: payload.route_id
       };
    }

    return payload;
  }

  updateState(key, payload) {
    this.state = Object.assign({}, this.state, { [key]: payload });

    this.doFilter.emit(this.state);
  }

  initState() {
    this.state = {
      engagement: {
        ...this.commonEngageMentFilter[0]
      },

      for: {
        ...this.commonStudentFilter[0]
      },

      range: {
        ...this.dateFilter[0]
      }
    };
  }

  getFromArray(arr: Array<any>, key: string, val: number) {
    return arr.filter((item) => item[key] === val)[0];
  }

  getStateFromUrl() {
    const routeParams: any = this.route.snapshot.queryParams;

    this.state = Object.assign({}, this.state, {
      engagement: {
        ...this.getFromArray(this.engageMentFilter, 'route_id', routeParams.engagement)
      },

      for: {
        ...this.getFromArray(this.studentFilter, 'route_id', routeParams.for)
      },

      range: {
        ...this.getRange(routeParams)
      }
    });

    this.doFilter.emit(this.state);
  }

  getRange(routeParams) {
    const range = this.getFromArray(this.dateFilter, 'route_id', routeParams.range);

    return range ? range : {
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

  ngOnInit() {
    const search = new HttpParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    const todayDate = moment().endOf('day');

    this.dateFilter = [
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

    this.commonEngageMentFilter = [
      {
        route_id: 'all',
        label: this.cpI18n.translate('assess_all_engagements'),
        data: {
          type: null,
          value: 0,
          queryParam: 'scope'
        }
      },
      {
        route_id: 'all_services',
        label: this.cpI18n.translate('assess_all_services'),
        data: {
          type: 'services',
          value: 1,
          queryParam: 'scope'
        }
      },
      {
        route_id: 'all_events',
        label: this.cpI18n.translate('assess_all_events'),
        data: {
          type: 'events',
          value: 2,
          queryParam: 'scope'
        }
      }
    ];

    this.commonStudentFilter = [
      {
        route_id: 'all_students',
        label: this.cpI18n.translate('assess_all_students'),
        listId: null
      }
    ];

    this.route.data.subscribe((res: { zendesk: string; data: Array<any> }) => {
      // @data [services, lists]
      const _lists = [...this.commonStudentFilter];
      const _engagements = [...this.commonEngageMentFilter];

      if (res.data[0].length) {
        _engagements.push({
          label: this.cpI18n.translate('services'),
          value: null,
          heading: true
        });
      }

      res.data[1].forEach((list) => {
        _lists.push({
          route_id: list.name
            .toLowerCase()
            .split(' ')
            .join('_'),
          label: list.name,
          listId: list.id
        });
      });

      res.data[0].forEach((service) => {
        _engagements.push({
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

      this.studentFilter = _lists;
      this.engageMentFilter = _engagements;
    });

    if (
      this.route.snapshot.queryParams['engagement'] &&
      this.route.snapshot.queryParams['for'] &&
      this.route.snapshot.queryParams['range']
    ) {
      this.hasRouteData = true;
    }

    this.initState();

    if (!this.hasRouteData) {
      this.doFilter.emit(this.state);

      return;
    }

    this.getStateFromUrl();
  }
}
