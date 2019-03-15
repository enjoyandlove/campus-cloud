import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '@app/session';
import { BaseComponent } from '@app/base';
import { ManageHeaderService } from '../../utils';
import { ICalendar } from './../calendars.interface';
import { FORMAT } from '@shared/pipes/date/date.pipe';
import { CP_TRACK_TO } from '@shared/directives/tracking';
import { CalendarsService } from './../calendars.services';
import { amplitudeEvents } from '@shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '@shared/services';

@Component({
  selector: 'cp-calendars-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class CalendarsListComponent extends BaseComponent implements OnInit {
  loading;
  eventData;
  sortingLabels;
  selectedCalendar = null;
  launchEditModal = false;
  launchDeleteModal = false;
  launchCreateModal = false;
  dateFormat = FORMAT.SHORT;

  state = {
    calendars: [],
    search_str: null,
    sort_field: 'name',
    sort_direction: 'asc'
  };

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: CalendarsService,
    public cpTracking: CPTrackingService,
    public headerService: ManageHeaderService
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));

    this.fetch();
  }

  onPaginationNext() {
    super.goToNext();

    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();

    this.fetch();
  }

  onSearch(search_str) {
    this.state = Object.assign({}, this.state, { search_str });

    this.resetPagination();

    this.fetch();
  }

  private fetch() {
    const search = new HttpParams()
      .append('search_str', this.state.search_str)
      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction)
      .append('school_id', this.session.g.get('school').id.toString());

    const end = this.endRange;
    const start = this.startRange;

    super
      .fetchData(this.service.getCalendars(start, end, search))
      .then((res) => (this.state = { ...this.state, calendars: res.data }));
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };

    this.fetch();
  }

  onLaunchCreateModal() {
    this.launchCreateModal = true;

    setTimeout(
      () => {
        $('#calendarsCreate').modal();
      },

      1
    );
  }

  onCreated(newCalendar: ICalendar): void {
    this.launchCreateModal = false;
    this.state.calendars = [newCalendar, ...this.state.calendars];
  }

  onEditedLink(editedCalendar: ICalendar) {
    this.launchEditModal = false;
    this.selectedCalendar = null;

    this.state = Object.assign({}, this.state, {
      calendars: this.state.calendars.map(
        (calendar) => (calendar.id === editedCalendar.id ? editedCalendar : calendar)
      )
    });
  }

  onDeleted(calendarId: number) {
    this.selectedCalendar = null;
    this.launchDeleteModal = false;

    this.state = Object.assign({}, this.state, {
      calendars: this.state.calendars.filter((calendar) => calendar.id !== calendarId)
    });

    if (this.state.calendars.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
  }

  ngOnInit() {
    this.headerService.updateHeader();

    this.sortingLabels = {
      name: this.cpI18n.translate('name'),
      created: this.cpI18n.translate('created')
    };

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties: this.cpTracking.getEventProperties()
    };
  }
}
