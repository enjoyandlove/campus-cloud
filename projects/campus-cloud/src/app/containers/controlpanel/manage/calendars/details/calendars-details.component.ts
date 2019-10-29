import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { ICalendar } from './../calendars.interface';
import { CalendarsService } from './../calendars.services';
import { baseActions, IHeader } from './../../../../../store/base';
import { FORMAT } from './../../../../../shared/pipes/date/date.pipe';
import { CP_TRACK_TO } from '../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '../../../../../shared/services';

@Component({
  selector: 'cp-calendars-details',
  templateUrl: './calendars-details.component.html',
  styleUrls: ['./calendars-details.component.scss']
})
export class CalendarsDetailComponent extends BaseComponent implements OnInit {
  loading;
  eventData;
  sortingLabels;
  calendarId: number;
  calendar: ICalendar;
  selectedItem = null;
  launchDeleteModal = false;
  dateFormat = FORMAT.DATETIME;

  state = {
    items: [],
    search_str: null,
    sort_field: 'title',
    sort_direction: 'asc'
  };

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<IHeader>,
    public route: ActivatedRoute,
    public service: CalendarsService,
    public cpTracking: CPTrackingService
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  onPaginationNext() {
    super.goToNext();

    this.fetch();
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };

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
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: `[NOTRANSLATE]${this.calendar.name}[NOTRANSLATE]`,
        subheading: null,
        em: null,
        crumbs: {
          url: '/manage/calendars',
          label: 'calendars'
        },
        children: []
      }
    });
  }

  onDeleted(itemId: number) {
    this.selectedItem = null;
    this.launchDeleteModal = false;

    this.state = Object.assign({}, this.state, {
      items: this.state.items.filter((item) => item.id !== itemId)
    });

    if (this.state.items.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
  }

  fetch() {
    const itemSearch = new HttpParams()
      .set('search_str', this.state.search_str)
      .set('sort_field', this.state.sort_field)
      .set('sort_direction', this.state.sort_direction)
      .set('academic_calendar_id', this.calendarId.toString())
      .set('school_id', this.session.g.get('school').id.toString());

    const calendarSearch = new HttpParams().set(
      'school_id',
      this.session.g.get('school').id.toString()
    );

    const calendar$ = this.service.getCalendarById(this.calendarId, calendarSearch);
    const items$ = this.service.getItemsByCalendarId(this.startRange, this.endRange, itemSearch);

    const stream$ = calendar$.pipe(
      switchMap((calendarData: any) => {
        this.calendar = calendarData;

        return items$;
      })
    );

    super.fetchData(stream$).then((res) => {
      this.state = { ...this.state, items: res.data };
      this.buildHeader();
    });
  }

  ngOnInit() {
    this.calendarId = this.route.snapshot.params['calendarId'];

    this.fetch();

    const eventProperties = {
      ...this.cpTracking.getAmplitudeMenuProperties()
    };

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties
    };

    this.sortingLabels = {
      name: this.cpI18n.translate('name'),
      start_date: this.cpI18n.translate('start_date')
    };
  }
}
