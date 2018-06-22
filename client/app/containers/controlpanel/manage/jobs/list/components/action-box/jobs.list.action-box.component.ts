import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { IJob } from '../../../jobs.interface';
import { JobsService } from '../../../jobs.service';
import { CPSession } from '../../../../../../../session';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CPI18nService } from '../../../../../../../shared/services/i18n.service';
import { CPTrackingService } from '../../../../../../../shared/services';
import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';

export interface IState {
  jobs: Array<IJob>;
  store_id: number;
  search_str: string;
  sort_field: string;
  sort_direction: string;
}

const state = {
  jobs: [],
  store_id: null,
  search_str: null,
  sort_field: 'title',
  sort_direction: 'asc'
};

@Component({
  selector: 'cp-jobs-list-action-box',
  templateUrl: './jobs.list.action-box.component.html',
  styleUrls: ['./jobs.list.action-box.component.scss']
})
export class JobsListActionBoxComponent implements OnInit {
  employers$;

  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() listAction: EventEmitter<any> = new EventEmitter();

  amplitudeEvents;
  state: IState = state;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public jobsService: JobsService,
    public cpTracking: CPTrackingService
  ) {}

  onSearch(query) {
    this.search.emit(query);
  }

  onFilterByEmployer(store_id) {
    this.state = Object.assign({}, this.state, { store_id });

    this.listAction.emit(this.state);
  }

  trackEvent(eventName) {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      create_page_name: amplitudeEvents.CREATE_JOB
    };

    return {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName,
      eventProperties
    };
  }

  ngOnInit() {
    this.employers$ = this.jobsService.getEmployers('all');

    this.amplitudeEvents = {
      clicked_create: amplitudeEvents.CLICKED_CREATE
    };
  }
}
