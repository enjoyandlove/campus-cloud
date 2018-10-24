import { Component, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { EventsService } from '../../events.service';
import { CPSession } from '../../../../../../session';
import { BaseComponent } from '../../../../../../base/base.component';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';

interface IState {
  start: number;
  end: number;
  search_str: string;
  store_id: number;
  attendance_only: number;
  sort_field: string;
  sort_direction: string;
  events: any[];
  exclude_current: number;
}

const state = {
  start: null,
  end: null,
  store_id: null,
  search_str: null,
  attendance_only: 0,
  sort_field: 'start',
  sort_direction: 'asc',
  exclude_current: null,
  events: []
};

@Component({
  selector: 'cp-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent extends BaseComponent {
  @Input() clubId: number;
  @Input() storeId: number;
  @Input() isClub: boolean;
  @Input() serviceId: number;
  @Input() isService: boolean;
  @Input() athleticId: number;
  @Input() isAthletic: boolean;
  @Input() orientationId: number;
  @Input() isOrientation: boolean;

  school;
  events;
  loading;
  pageNext;
  pagePrev;
  pageNumber;
  isUpcoming;
  orientation;
  deleteEvent = '';
  state: IState = state;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: EventsService
  ) {
    super();
    this.school = this.session.g.get('school');
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  private fetch(stream$) {
    super.fetchData(stream$).then((res) => {
      this.state = Object.assign({}, this.state, { events: res.data });
    });
  }

  onSortList(sort) {
    this.state = Object.assign({}, this.state, {
      sort_field: sort.sort_field,
      sort_direction: sort.sort_direction
    });

    this.buildHeaders();
  }

  doFilter(filter) {
    let storeId;
    const isUpcoming = filter.upcoming;

    if (this.isClub) {
      storeId = this.clubId;
    }

    if (this.isService) {
      storeId = this.serviceId;
    }

    if (filter.search_str) {
      this.resetPagination();
    }

    this.state = Object.assign({}, this.state, {
      end: filter.end,
      start: filter.start,
      sort_field: 'start',
      exclude_current: null,
      sort_direction: 'asc',
      store_id: storeId ? storeId : filter.store_id,
      search_str: filter.search_str,
      attendance_only: filter.attendance_only
    });

    if (!isUpcoming) {
      this.state = Object.assign({}, this.state, {
        sort_field: 'end',
        exclude_current: 1,
        sort_direction: 'desc'
      });
    }

    this.isUpcoming = isUpcoming;

    this.buildHeaders();
  }

  buildHeaders() {
    const end = this.endRange;
    const start = this.startRange;

    const exclude_current = this.state.exclude_current
      ? this.state.exclude_current.toString()
      : null;

    let store_id = this.state.store_id ? this.state.store_id.toString() : null;
    const calendar_id = this.orientationId ? this.orientationId.toString() : null;

    if (this.storeId) {
      store_id = this.storeId.toString();
    }

    let search = new HttpParams()
      .append('start', this.state.start.toString())
      .append('end', this.state.end.toString())
      .append('school_id', this.session.g.get('school').id.toString())
      .append('search_str', this.state.search_str)
      .append('attendance_only', this.state.attendance_only.toString())

      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction);

    if (store_id) {
      search = search.append('store_id', store_id);
    }
    if (exclude_current) {
      search = search.append('exclude_current', exclude_current);
    }
    if (calendar_id) {
      search = search.append('calendar_id', calendar_id);
    }

    this.fetch(this.service.getEvents(start, end, search));
  }

  onDeleteEvent(event) {
    this.deleteEvent = event;
    this.orientation = this.isOrientation;
  }

  onDeletedEvent(eventId) {
    this.state = Object.assign({}, this.state, {
      events: this.state.events.filter((event) => event.id !== eventId)
    });

    if (this.state.events.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.buildHeaders();
    }
  }

  onPaginationNext() {
    super.goToNext();

    this.buildHeaders();
  }

  onPaginationPrevious() {
    super.goToPrevious();

    this.buildHeaders();
  }
}
