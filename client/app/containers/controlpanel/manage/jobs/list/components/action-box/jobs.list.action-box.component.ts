import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { IJob } from '../../../jobs.interface';
import { JobsService } from '../../../jobs.service';
import { CPSession } from '../../../../../../../session';
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

  state: IState = state;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public jobsService: JobsService
  ) {}

  onSearch(query) {
    this.search.emit(query);
  }

  onFilterByEmployer(store_id) {
    this.state = Object.assign({}, this.state, { store_id });

    this.listAction.emit(this.state);
  }

  ngOnInit() {
    this.employers$ = this.jobsService.getEmployers('all');
  }
}
