import { Component, OnInit, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { CPSession } from './../../../../../../../../../session';
import IServiceProvider from '../../../../../providers.interface';
import { ProvidersService } from '../../../../../providers.service';
import { FORMAT } from '../../../../../../../../../shared/pipes/date';
import { ServicesUtilsService } from '../../../../../services.utils.service';
import { BaseComponent } from '../../../../../../../../../base/base.component';
import { EventUtilService } from '../../../../../../events/events.utils.service';
import { amplitudeEvents } from '../../../../../../../../../shared/constants/analytics';
import { CPI18nService } from './../../../../../../../../../shared/services/i18n.service';
import { CPTrackingService, RouteLevel } from '../../../../../../../../../shared/services';
import { CheckInMethod, CheckInOutTime, CheckOut } from '../../../../../../events/event.status';

interface IState {
  end: string;
  start: string;
  search_text: string;
  sort_field: string;
  sort_direction: string;
}

const state: IState = {
  end: null,
  start: null,
  search_text: null,
  sort_field: 'check_in_time',
  sort_direction: 'desc'
};

@Component({
  selector: 'cp-providers-attendees-list',
  templateUrl: './providers-attendees-list.component.html',
  styleUrls: ['./providers-attendees-list.component.scss']
})
export class ServicesProvidersAttendeesListComponent extends BaseComponent implements OnInit {
  @Input() serviceId: number;
  @Input() providerId: number;
  @Input() provider: IServiceProvider;

  loading;
  checkInData;
  assessments;
  hasAttendees;
  sortingLabels;
  eventProperties;
  state: IState = state;
  isAddCheckInModal = false;
  isEditCheckInModal = false;
  isDeleteCheckInModal = false;
  dateFormat = FORMAT.DATETIME_SHORT;
  webCheckInMethod = CheckInMethod.web;
  emptyCheckOutTime = CheckInOutTime.empty;
  defaultImage = require('public/default/user.png');

  constructor(
    public session: CPSession,
    private cpI18n: CPI18nService,
    private utils: ServicesUtilsService,
    private eventUtils: EventUtilService,
    private cpTracking: CPTrackingService,
    private providersService: ProvidersService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  fetch() {
    const search = new HttpParams()
      .append('end', this.state.end)
      .append('start', this.state.start)
      .append('search_text', this.state.search_text)
      .append('service_id', this.provider.campus_service_id.toString())
      .append('service_provider_id', this.provider.id.toString())
      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction);

    const stream$ = this.providersService.getProviderAssessments(
      this.startRange,
      this.endRange,
      search
    );

    super.fetchData(stream$).then((res) => {
      this.assessments = res.data;
      this.hasAttendees = res.data.length > 0;
    });
  }

  onPaginationNext() {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetch();
  }

  fetchAllRecords(): Promise<any> {
    const search = new HttpParams()
      .append('all', '1')
      .append('end', this.state.end)
      .append('start', this.state.start)
      .append('search_text', this.state.search_text)
      .append('service_id', this.provider.campus_service_id.toString())
      .append('service_provider_id', this.provider.id.toString());

    const stream$ = this.providersService.getProviderAssessments(
      this.startRange,
      this.endRange,
      search
    );

    return stream$.toPromise();
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };

    this.fetch();
  }

  doSearch(search_text) {
    this.state = {
      ...this.state,
      search_text
    };

    this.fetch();
  }

  doDateFilter(dateRange) {
    this.state = {
      ...this.state,
      start: dateRange.start,
      end: dateRange.end
    };

    this.fetch();
  }

  onCreateCheckIn() {
    this.isAddCheckInModal = true;
    setTimeout(
      () => {
        $('#addCheckInModal').modal();
      },

      1
    );
  }

  onEditCheckIn(attendee) {
    this.checkInData = attendee;
    this.isEditCheckInModal = true;
    setTimeout(
      () => {
        $('#editCheckInModal').modal();
      },

      1
    );
  }

  onDeleteCheckIn(attendee) {
    this.checkInData = attendee;
    this.isDeleteCheckInModal = true;
    setTimeout(
      () => {
        $('#deleteCheckInModal').modal();
      },

      1
    );
  }

  onCreated(checkedInData) {
    this.isAddCheckInModal = false;
    this.fetch();
    this.trackAddedCheckInEvent(checkedInData);
  }

  onEdited() {
    this.checkInData = null;
    this.isEditCheckInModal = false;
    this.fetch();
  }

  onDeleted(id: number) {
    this.checkInData = null;
    this.isDeleteCheckInModal = false;

    this.assessments = this.assessments.filter((attendee) => attendee.id !== id);

    if (this.assessments.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
  }

  downloadProvidersCSV() {
    if (this.assessments.length) {
      this.trackAmplitudeEvent();
      this.fetchAllRecords().then((attendees) =>
        this.utils.exportServiceProvidersAttendees(attendees)
      );
    }
  }

  trackAmplitudeEvent() {
    this.eventProperties = {
      data_source: amplitudeEvents.SERVICE_PROVIDER,
      sub_menu_name: this.cpTracking.activatedRoute(RouteLevel.second)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_DOWNLOAD_DATA, this.eventProperties);
  }

  trackAddedCheckInEvent(checkedInData) {
    const eventProperties = {
      ...this.eventUtils.getQRCodeCheckOutStatus(this.provider),
      check_in_type: amplitudeEvents.SERVICE_PROVIDER,
      source_id: this.provider.encrypted_campus_service_id,
      sub_menu_name: this.cpTracking.activatedRoute(RouteLevel.second),
      check_out: checkedInData.check_out_time_epoch > 0 ? CheckOut.yes : CheckOut.no
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.ADDED_CHECK_IN,
      eventProperties
    );
  }

  ngOnInit() {
    this.fetch();

    this.sortingLabels = {
      checkin_time: this.cpI18n.translate('services_label_checkin_time'),
      checkout_time: this.cpI18n.translate('t_services_label_checkout_time'),
      checkin_method: this.cpI18n.translate('services_label_all_checkin_methods')
    };
  }
}
