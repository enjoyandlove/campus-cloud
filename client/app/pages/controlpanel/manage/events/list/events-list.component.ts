import { Component, OnInit, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

interface IState {
  start: number;
  end: number;
  store_id: number;
  attendance_only: number;
  sort_field: string;
  sort_direction: string;
}

const state = {
  start: null,
  end: null,
  store_id: null,
  attendance_only: 0,
  sort_field: 'start',
  sort_direction: 'asc'
};

@Component({
  selector: 'cp-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent extends BaseComponent implements OnInit, OnDestroy {
  events;
  loading;
  pagePrev;
  pageNext;
  isUpcoming;
  pageNumber = 1;
  deleteEvent = '';
  state: IState = state;

  constructor(
    private store: Store<IHeader>,
    private service: EventsService
  ) {
    super();
    this.buildHeader();
    super.isLoading().subscribe(res => this.loading = res);
  }

  private fetch(stream$) {
    super
      .fetchData(stream$)
      .then(res => {
        this.events = res.data;
        this.pagePrev = res.pagePrev;
        this.pageNext = res.pageNext;
      })
      .catch(err => console.error(err));
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../../manage.header.json')
    });
  }

  onSortList(sort) {
    this.state = Object.assign(
      {},
      this.state,
      {
        sort_field: sort.sort_field,
        sort_direction: sort.sort_direction
      }
    );

    this.buildHeaders();
  }

  doFilter(filter) {
    this.state = Object.assign(
      {},
      this.state,
      {
        start: filter.start,
        end: filter.end,
        store_id: filter.store_id,
        attendance_only: filter.attendance_only
      }
    );

    this.isUpcoming = filter.upcoming;

    this.buildHeaders();
  }

  buildHeaders() {
    let end = super.getEndRange();
    let start = super.getStartRange();
    let search = new URLSearchParams();
    let store_id = this.state.store_id ? (this.state.store_id).toString() : null;

    search.append('start', (this.state.start).toString());
    search.append('end', (this.state.end).toString());
    search.append('store_id', store_id);
    search.append('attendance_only', (this.state.attendance_only).toString());

    search.append('sort_field', this.state.sort_field);
    search.append('sort_direction', this.state.sort_direction);

    this.fetch(this.service.getEvents(start, end, search));
  }

  onDeleteEvent(event) {
    this.deleteEvent = event;
  }

  onPaginationNext() {
    super.goToNext();
    this.pageNumber = super.getPageNumber();

    this.buildHeaders();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.pageNumber = super.getPageNumber();

    this.buildHeaders();
  }

  ngOnDestroy() {
    // console.log('destroy');
  }

  ngOnInit() { }
}
