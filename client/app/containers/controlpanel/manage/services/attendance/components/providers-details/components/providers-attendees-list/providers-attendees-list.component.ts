import { Component, OnInit, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { CPSession } from './../../../../../../../../../session';
import { ProvidersService } from '../../../../../providers.service';
import { FORMAT } from '../../../../../../../../../shared/pipes/date';
import { ServicesUtilsService } from '../../../../../services.utils.service';
import { CPTrackingService } from '../../../../../../../../../shared/services';
import { BaseComponent } from '../../../../../../../../../base/base.component';
import { CheckInMethod, CheckInOutTime } from '../../../../../../events/event.status';
import { amplitudeEvents } from '../../../../../../../../../shared/constants/analytics';
import { CPI18nService } from './../../../../../../../../../shared/services/i18n.service';

interface IState {
  search_text: string;
  sort_field: string;
  sort_direction: string;
}

const state: IState = {
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
  @Input() provider;
  @Input() serviceId: number;
  @Input() providerId: number;

  loading;
  checkInData;
  assessments;
  sortingLabels;
  eventProperties;
  state: IState = state;
  isAddCheckInModal = false;
  isEditCheckInModal = false;
  isDeleteCheckInModal = false;
  dateFormat = FORMAT.DATETIME;
  webCheckInMethod = CheckInMethod.web;
  emptyCheckOutTime = CheckInOutTime.empty;
  defaultImage = require('public/default/user.png');

  constructor(
    public session: CPSession,
    private cpI18n: CPI18nService,
    private utils: ServicesUtilsService,
    private cpTracking: CPTrackingService,
    private providersService: ProvidersService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  fetch() {
    const search = new HttpParams()
      .append('search_text', this.state.search_text)
      .append('service_id', this.serviceId.toString())
      .append('service_provider_id', this.providerId.toString())
      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction);

    const stream$ = this.providersService.getProviderAssessments(
      this.startRange,
      this.endRange,
      search
    );

    super.fetchData(stream$).then((res) => {
      this.assessments = res.data;
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
      .append('service_id', this.serviceId.toString())
      .append('service_provider_id', this.providerId.toString());

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

  onCreated() {
    this.isAddCheckInModal = false;
    this.fetch();
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
        this.utils.exportServiceProvidersAttendees(attendees));
    }
  }

  trackAmplitudeEvent() {
    this.eventProperties = {
      data_type: amplitudeEvents.ATTENDANCE
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_DOWNLOAD_DATA, this.eventProperties);
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
