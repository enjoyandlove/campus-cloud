import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { of as observableOf } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HEADER_UPDATE, IHeader } from './../../../../../reducers/header.reducer';
import { FORMAT } from './../../../../../shared/pipes/date/date.pipe';
import { ICalendar } from './../calendars.interface';
import { CalendarsService } from './../calendars.services';
import { BaseComponent } from '../../../../../base';
import { CPSession } from '../../../../../session';
import { CPI18nService } from '../../../../../shared/services';

@Component({
  selector: 'cp-calendars-details',
  templateUrl: './calendars-details.component.html',
  styleUrls: ['./calendars-details.component.scss']
})
export class CalendarsDetailComponent extends BaseComponent implements OnInit {
  loading;
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
    public service: CalendarsService
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
    this.calendarId = this.route.snapshot.params['calendarId'];

    this.fetch();
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
      type: HEADER_UPDATE,
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

  ngOnInit() {}

  private fetch() {
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

    super.fetchData(observableOf(stream$)).then((res) => {
      this.state = { ...this.state, items: res.data };
      this.buildHeader();
    });
  }
}
