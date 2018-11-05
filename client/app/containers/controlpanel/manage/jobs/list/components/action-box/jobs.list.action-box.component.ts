import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { IJob } from '../../../jobs.interface';
import { JobsService } from '../../../jobs.service';
import { CPSession } from '../../../../../../../session';
import * as fromJobs from '../../../../../../../store/manage';
import { CPTrackingService } from '../../../../../../../shared/services';
import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CPI18nService } from '../../../../../../../shared/services/i18n.service';

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

  eventPageItemData;
  eventCreateItemData;
  state: IState = state;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public jobsService: JobsService,
    public cpTracking: CPTrackingService,
    private store: Store<fromJobs.IJobsState>
  ) {}

  onSearch(query) {
    this.search.emit(query);
  }

  onFilterByEmployer(store_id) {
    this.state = Object.assign({}, this.state, { store_id });

    this.listAction.emit(this.state);
  }

  setEventProperties(page_type = null) {
    return {
      ...this.cpTracking.getEventProperties(),
      page_type
    };
  }

  ngOnInit() {
    const dropdownLabel = this.cpI18n.translate('employer_all_employers');
    this.employers$ = this.store
      .select(fromJobs.getJobsEmployers)
      .pipe(
        startWith([{ label: dropdownLabel }]),
        map((employers) => [{ label: dropdownLabel, action: null }, ...employers])
      );
    this.store.select(fromJobs.getJobsLoaded).subscribe((loaded: boolean) => {
      if (!loaded) {
        this.store.dispatch(new fromJobs.LoadEmployers());
      }
    });

    this.eventPageItemData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_PAGE_ITEM,
      eventProperties: this.setEventProperties(amplitudeEvents.EMPLOYER)
    };

    this.eventCreateItemData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CREATE_ITEM,
      eventProperties: this.setEventProperties()
    };
  }
}
