import { Component, OnInit, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { get as _get } from 'lodash';

import { FORMAT } from '@campus-cloud/shared/pipes/date';
import { DEFAULT } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { AttendeeType } from '@controlpanel/manage/events/event.status';
import { CPI18nService } from '@campus-cloud/shared/services/i18n.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import { IService } from '@campus-cloud/containers/controlpanel/manage/services/service.interface';
import IServiceProvider from '@campus-cloud/containers/controlpanel/manage/services/providers.interface';
import { ProvidersService } from '@campus-cloud/containers/controlpanel/manage/services/providers.service';
import { EventsAmplitudeService } from '@controlpanel/manage/events/events.amplitude.service';
import { ServicesUtilsService } from '@campus-cloud/containers/controlpanel/manage/services/services.utils.service';
import { ICheckIn } from '@campus-cloud/containers/controlpanel/manage/events/attendance/check-in/check-in.interface';
import { AMPLITUDE_INTERVAL_MAP } from '@campus-cloud/containers/controlpanel/assess/engagement/engagement.utils.service';
import {
  CheckInOut,
  CheckInMethod,
  CheckInOutTime
} from '@campus-cloud/containers/controlpanel/manage/events/event.status';
import {
  IFilterState,
  ProvidersUtilsService
} from '@campus-cloud/containers/controlpanel/manage/services/providers.utils.service';

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
  @Input() service: IService;
  @Input() serviceId: number;
  @Input() providerId: number;
  @Input() provider: IServiceProvider;

  _filterState;
  get filterState(): IFilterState {
    return this._filterState;
  }
  @Input('filterState')
  set filterState(value: IFilterState) {
    this._filterState = value;
    this.fetch();
  }

  loading;
  checkInData;
  assessments;
  hasAttendees;
  sortingLabels;
  eventProperties;
  state: IState = state;
  checkInEventProperties;
  isAddCheckInModal = false;
  isEditCheckInModal = false;
  isDeleteCheckInModal = false;
  dateFormat = FORMAT.DATETIME_SHORT;
  webCheckInMethod = CheckInMethod.web;
  deletedAttendee = AttendeeType.deleted;
  emptyCheckOutTime = CheckInOutTime.empty;
  defaultImage = `${environment.root}assets/default/user.png`;

  constructor(
    private cpI18n: CPI18nService,
    private utils: ServicesUtilsService,
    private cpTracking: CPTrackingService,
    public providersService: ProvidersService,
    public providerUtils: ProvidersUtilsService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  fetch() {
    let search = new HttpParams()
      .append('service_id', this.provider.campus_service_id.toString())
      .append('service_provider_id', this.provider.id.toString())
      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction);

    search = this.providerUtils.addSearchParams(search, this.filterState);

    const stream$ = this.providersService.getProviderAssessments(
      this.startRange,
      this.endRange,
      search
    );

    super
      .fetchData(stream$)
      .then((res) => {
        this.assessments = res.data;
        this.hasAttendees = res.data.length > 0;
      })
      .catch(() => {
        this.loading = false;
        this.assessments = [];
        this.hasAttendees = false;
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
    let search = new HttpParams()
      .set('service_id', this.provider.campus_service_id.toString())
      .set('service_provider_id', this.provider.id.toString())
      .set('sort_field', this.state.sort_field)
      .set('sort_direction', this.state.sort_direction)
      .set('all', '1');

    search = this.providerUtils.addSearchParams(search, this.filterState);

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

  onCreateCheckIn() {
    this.isAddCheckInModal = true;
    setTimeout(
      () => {
        $('#addCheckInModal').modal({ keyboard: true, focus: true });
      },

      1
    );
  }

  onEditCheckIn(attendee) {
    this.checkInData = attendee;
    this.isEditCheckInModal = true;
    setTimeout(
      () => {
        $('#editCheckInModal').modal({ keyboard: true, focus: true });
      },

      1
    );
  }

  onDeleteCheckIn(attendee) {
    this.checkInData = attendee;
    this.isDeleteCheckInModal = true;
    setTimeout(
      () => {
        $('#deleteCheckInModal').modal({ keyboard: true, focus: true });
      },

      1
    );
  }

  onCreated(checkedInData: ICheckIn) {
    this.isAddCheckInModal = false;
    this.fetch();

    const hasCheckOut = checkedInData.check_out_time_epoch > 0;
    const check_out = hasCheckOut ? CheckInOut.yes : CheckInOut.no;
    const eventProperties = {
      ...this.checkInEventProperties,
      check_out
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_ADDED_ATTENDANCE, eventProperties);
  }

  onEdited(checkInOut) {
    this.checkInData = null;
    this.isEditCheckInModal = false;
    this.fetch();

    const eventProperties = {
      ...this.checkInEventProperties,
      check_in: checkInOut.checkIn,
      check_out: checkInOut.checkOut
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_UPDATED_ATTENDANCE, eventProperties);
  }

  onDeleted(id: number) {
    this.checkInData = null;
    this.isDeleteCheckInModal = false;

    this.assessments = this.assessments.filter((attendee) => attendee.id !== id);

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_DELETED_ATTENDANCE,
      this.checkInEventProperties
    );

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

  trackQrCodeEvent() {
    const eventProperties = {
      ...EventsAmplitudeService.getQRCodeCheckOutStatus(this.provider),
      assessment_type: amplitudeEvents.SERVICE_PROVIDER,
      source_id: this.provider.encrypted_campus_service_id,
      sub_menu_name: amplitudeEvents.SERVICES
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_CHANGED_QR_CODE, eventProperties);
  }

  trackAmplitudeEvent() {
    const assessment_status = this.provider.has_checkout
      ? amplitudeEvents.CHECKIN_AND_CHECKOUT
      : amplitudeEvents.CHECKIN_ONLY;

    const feedback_status = this.provider.has_feedback
      ? amplitudeEvents.ENABLED
      : amplitudeEvents.DISABLED;

    const filter_type = _get(
      this.filterState,
      ['studentFilter', 'cohort_type'],
      amplitudeEvents.ALL_STUDENTS
    );

    const dateType = _get(this.filterState, ['dateRange', 'label'], DEFAULT);
    const interval = Object.values(AMPLITUDE_INTERVAL_MAP).includes(dateType)
      ? dateType
      : amplitudeEvents.CUSTOM;

    this.eventProperties = {
      interval,
      filter_type,
      feedback_status,
      assessment_status,
      source_id: this.provider.encrypted_id,
      provider_type: amplitudeEvents.ONE_PROVIDER
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_DOWNLOAD_SERVICE_ASSESS_DATA,
      this.eventProperties
    );
  }

  setCheckInEventProperties() {
    this.checkInEventProperties = {
      ...EventsAmplitudeService.getQRCodeCheckOutStatus(this.provider),
      source_id: this.provider.encrypted_campus_service_id,
      assessment_type: amplitudeEvents.SERVICE_PROVIDER,
      sub_menu_name: amplitudeEvents.SERVICES
    };
  }

  ngOnInit() {
    this.setCheckInEventProperties();

    this.sortingLabels = {
      checkin_time: this.cpI18n.translate('services_label_checkin_time'),
      checkout_time: this.cpI18n.translate('t_services_label_checkout_time'),
      checkin_method: this.cpI18n.translate('services_label_all_checkin_methods')
    };
  }
}
