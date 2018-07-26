import { OnInit, Output, Component, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CPSession } from '../../../../../../session';
import { EngagementUtilsService } from '../../engagement.utils.service';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';

interface IState {
  engagement: {
    route_id: string;
    label: string;
    data: {
      type: string;
      value: number;
    };
  };

  for: {
    route_id: string;
    label: string;
    listId: number;
  };

  range: {
    route_id: string;
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

  hasRouteData;
  state: IState;
  studentFilter;
  engagementFilter;
  datePickerClass = 'cancel';
  icon = 'keyboard_arrow_down';

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    private route: ActivatedRoute,
    private utils: EngagementUtilsService
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
        payload: this.utils.setDateRange(payload),
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
      ...this.state,
      engagement: {
        ...this.utils.commonEngagementFilter()[0]
      },

      for: {
        ...this.utils.commonStudentFilter()[0]
      },

      range: {
        ...this.utils.dateFilter()[0]
      }
    };
  }

  getStateFromUrl() {
    const routeParams: any = this.route.snapshot.queryParams;

    this.state = Object.assign({}, this.state, {
      engagement: {
        ...this.utils.getFromArray(this.engagementFilter, 'route_id', routeParams.engagement)
      },

      for: {
        ...this.utils.getFromArray(this.studentFilter, 'route_id', routeParams.for)
      },

      range: {
        ...this.utils.getRange(routeParams)
      }
    });

    this.doFilter.emit(this.state);
  }

  ngOnInit() {
    this.route.data.subscribe((res: { zendesk: string; data: Array<any> }) => {
      // @data [services, lists, persona]
      let _persona = [];
      let _services = [];
      let _audiences = [];

      if (res.data[0].length) {
        _services = this.utils.parsedServices(res.data[0]);
      }

      if (res.data[1].length) {
        _audiences = this.utils.parsedAudiences(res.data[1]);
      }

      if (res.data[2].length) {
        _persona = this.utils.parsedPersona(res.data[2]);
      }

      this.engagementFilter = [...this.utils.commonEngagementFilter(), ..._services];

      this.studentFilter = [...this.utils.commonStudentFilter(), ..._persona, ..._audiences];
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
