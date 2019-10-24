import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { ManageHeaderService } from '../../utils';
import { ICalendar } from './../calendars.interface';
import { CalendarsService } from './../calendars.services';
import { FORMAT } from '@campus-cloud/shared/pipes/date/date.pipe';
import { CP_TRACK_TO } from '@campus-cloud/shared/directives/tracking';
import { CPDatePipe } from '@campus-cloud/shared/pipes/date/date.pipe';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-calendars-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class CalendarsListComponent extends BaseComponent implements OnInit {
  @ViewChild('customMainCell', { static: true, read: TemplateRef })
  private customMainCell: TemplateRef<any>;
  @ViewChild('actionCell', { static: true, read: TemplateRef })
  private actionCell: TemplateRef<any>;

  loading;
  eventData;
  sortingLabels;
  rows = [];
  columns = [];
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
    private cpDatePipe: CPDatePipe,
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

  onDeleteTeardown() {
    this.launchDeleteModal = false;
    $('#calendarDelete').modal('hide');
  }

  private fetch() {
    const search = new HttpParams()
      .append('search_str', this.state.search_str)
      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction)
      .append('school_id', this.session.g.get('school').id.toString());

    const end = this.endRange;
    const start = this.startRange;

    super.fetchData(this.service.getCalendars(start, end, search)).then((res) => {
      this.state = { ...this.state, calendars: res.data };
      this.formatTableData();
    });
  }

  formatTableData() {
    this.columns = [
      {
        sortable: true,
        label: this.sortingLabels.name,
        sorting: this.state.sort_field === 'name',
        sortingDirection: this.state.sort_direction,
        onClick: () => this.doSort.call(this, 'name')
      },
      {
        sortable: true,
        label: this.sortingLabels.created,
        sorting: this.state.sort_field === 'created_time',
        sortingDirection: this.state.sort_direction,
        onClick: () => this.doSort.call(this, 'created_time')
      },
      { label: '', sortable: false }
    ];

    this.rows = this.state.calendars.map((calendar) => {
      return [
        {
          template: this.customMainCell,
          context: { ...calendar }
        },
        { label: this.cpDatePipe.transform(calendar.created_time, this.dateFormat) },
        {
          template: this.actionCell,
          context: { ...calendar }
        }
      ];
    });
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };

    this.fetch();
  }

  onLaunchCreateModal() {
    this.launchCreateModal = true;

    setTimeout(
      () => {
        $('#calendarsCreate').modal({ keyboard: true, focus: true });
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
      calendars: this.state.calendars.map((calendar) =>
        calendar.id === editedCalendar.id ? editedCalendar : calendar
      )
    });

    this.formatTableData();
  }

  onDeleted(calendarId: number) {
    this.selectedCalendar = null;
    this.launchDeleteModal = false;

    this.state = Object.assign({}, this.state, {
      calendars: this.state.calendars.filter((calendar) => calendar.id !== calendarId)
    });

    this.formatTableData();

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
