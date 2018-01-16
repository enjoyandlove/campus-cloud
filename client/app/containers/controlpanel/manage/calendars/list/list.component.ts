import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { FORMAT } from './../../../../../shared/pipes/date/date.pipe';
import { ICalendar } from './../calendars.interface';
import { CalendarsService } from './../calendars.services';
import { BaseComponent } from '../../../../../base';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';
import { CPSession } from '../../../../../session';
import { CPI18nService } from '../../../../../shared/services';
import { ManageHeaderService } from '../../utils';

@Component({
  selector: 'cp-calendars-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class CalendarsListComponent extends BaseComponent implements OnInit {
  loading;
  selectedCalendar = null;
  launchEditModal = false;
  launchDeleteModal = false;
  launchCreateModal = false;
  dateFormat = FORMAT.SHORT;

  state = {
    calendars: [],
    search_str: null,
  };

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<IHeader>,
    public service: CalendarsService,
    public headerService: ManageHeaderService,
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

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: this.headerService.filterByPrivileges(),
    });
  }

  private fetch() {
    const search = new URLSearchParams();
    search.append('search_str', this.state.search_str);
    search.append('school_id', this.session.g.get('school').id.toString());

    const end = this.endRange;
    const start = this.startRange;

    super
      .fetchData(this.service.getCalendars(start, end, search))
      .then((res) => (this.state = { ...this.state, calendars: res.data }))
      .catch((err) => {
        throw new Error(err);
      });
  }

  onLaunchCreateModal() {
    this.launchCreateModal = true;

    setTimeout(
      () => {
        $('#calendarsCreate').modal();
      },

      1,
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
        (calendar) =>
          calendar.id === editedCalendar.id ? editedCalendar : calendar,
      ),
    });
  }

  onDeleted(calendarId: number) {
    this.selectedCalendar = null;
    this.launchDeleteModal = false;

    this.state = Object.assign({}, this.state, {
      calendars: this.state.calendars.filter(
        (calendar) => calendar.id !== calendarId,
      ),
    });

    if (this.state.calendars.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
  }

  ngOnInit() {
    this.buildHeader();
  }
}
