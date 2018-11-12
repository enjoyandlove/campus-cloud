import { Component, OnInit, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/index';
import { Store } from '@ngrx/store';

import IEvent from '../event.interface';
import { EventsService } from '../events.service';
import { CPSession } from '../../../../../session';
import { FORMAT } from '../../../../../shared/pipes';
import { ICheckIn } from './check-in/check-in.interface';
import { EventUtilService } from './../events.utils.service';
import { EventsComponent } from '../list/base/events.component';
import { IHeader, baseActions } from '../../../../../store/base';
import { isClubAthletic } from '../../clubs/clubs.athletics.labels';
import { CP_PRIVILEGES_MAP } from '../../../../../shared/constants';
import { CheckInMethod, CheckInOutTime, CheckInOut } from '../event.status';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService, RouteLevel } from '../../../../../shared/services';
import {
  canSchoolReadResource,
  canSchoolWriteResource
} from '../../../../../shared/utils/privileges/privileges';

interface IState {
  sort_field: string;
  sort_direction: string;
  search_text: string;
}

const state = {
  sort_field: 'firstname',
  sort_direction: 'asc',
  search_text: null
};

@Component({
  selector: 'cp-events-attendance',
  templateUrl: './events-attendance.component.html',
  styleUrls: ['./events-attendance.component.scss']
})
export class EventsAttendanceComponent extends EventsComponent implements OnInit {
  @Input() isClub: boolean;
  @Input() clubId: number;
  @Input() serviceId: number;
  @Input() isService: boolean;
  @Input() athleticId: number;
  @Input() isAthletic: boolean;
  @Input() orientationId: number;
  @Input() isOrientation: boolean;

  event;
  urlPrefix;
  canMessage;
  messageData;
  checkInData;
  sortingLabels;
  attendees = [];
  loading = true;
  showStudentIds;
  eventId: number;
  allStudents = false;
  state: IState = state;
  checkInEventProperties;
  attendeesLoading = true;
  downloadEventProperties;
  isAddCheckInModal = false;
  isEditCheckInModal = false;
  isSendMessageModal = false;
  messageAttendeesTooltipText;
  isDeleteCheckInModal = false;
  appCheckIn = CheckInMethod.app;
  webCheckIn = CheckInMethod.web;
  dateFormat = FORMAT.DATETIME_SHORT;
  emptyCheckOutTime = CheckInOutTime.empty;
  updateQrCode = new BehaviorSubject(null);
  totalAttendees = new BehaviorSubject(null);
  defaultImage = require('public/default/user.png');

  eventProperties = {
    host_type: null,
    sub_menu_name: null,
    engagement_type: null,
    announcement_source: null
  };

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    public service: EventsService,
    private utils: EventUtilService,
    public cpTracking: CPTrackingService
  ) {
    super(session, cpI18n, service);
    this.eventId = this.route.snapshot.params['eventId'];
    super.isLoading().subscribe((res) => (this.attendeesLoading = res));
  }

  public fetch() {
    let search = new HttpParams();

    if (this.orientationId) {
      search = search
        .append('school_id', this.session.g.get('school').id)
        .append('calendar_id', this.orientationId.toString());
    }

    super.fetchData(this.service.getEventById(this.eventId, search)).then((event) => {
      this.event = event.data;
      this.fetchAttendees();
      this.buildHeader(event.data);
      this.loading = false;
      this.setCheckInEventProperties();
      this.updateQrCode.next(this.event.attend_verification_methods);
    });
  }

  public buildHeader(event) {
    const children = this.utils.getSubNavChildren(event, this.urlPrefix);

    const payload = {
      heading: `[NOTRANSLATE]${event.title}[NOTRANSLATE]`,

      subheading: '',

      crumbs: {
        url: this.urlPrefix,
        label: 'events'
      },

      children: [...children]
    };

    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload
    });
  }

  fetchAttendees() {
    let search = new HttpParams();

    search = search
      .append('event_id', this.event.id)
      .append('sort_field', this.state.sort_field)
      .append('search_text', this.state.search_text)
      .append('sort_direction', this.state.sort_direction);

    if (this.orientationId) {
      search = search
        .append('school_id', this.session.g.get('school').id)
        .append('calendar_id', this.orientationId.toString());
    }

    const stream$ = this.service.getEventAttendanceByEventId(
      this.startRange,
      this.endRange,
      search
    );

    super
      .fetchData(stream$)
      .then((res) => {
        this.attendees = res.data;
        this.totalAttendees.next(res.data);
        setTimeout(
          () => {
            $(function() {
              $('[data-toggle="tooltip"]').tooltip();
            });
          },

          10
        );
      })
      .catch((_) => {});
  }

  onPaginationNext() {
    super.goToNext();
    this.fetchAttendees();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetchAttendees();
  }

  doSort(sort_field) {
    this.state = Object.assign({}, this.state, {
      sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    });
    this.fetchAttendees();
  }

  checkInMethodType(method) {
    return method === CheckInMethod.web ? 'computer' : 'smartphone';
  }

  doSearch(search_text): void {
    search_text = search_text === '' ? null : search_text;
    this.state = Object.assign({}, this.state, { search_text });

    this.resetPagination();

    this.fetchAttendees();
  }

  onCreateExcel() {
    let search = new HttpParams().append('event_id', this.event.id).append('all', '1');

    if (this.isOrientation) {
      search = search
        .append('school_id', this.session.g.get('school').id)
        .append('calendar_id', this.orientationId.toString());
    }
    const stream$ = this.service.getEventAttendanceByEventId(
      this.startRange,
      this.endRange,
      search
    );

    this.trackAmplitudeEvent();

    this.utils.createExcel(stream$, this.showStudentIds, this.event);
  }

  trackAmplitudeEvent() {
    const check_out_status = this.event.has_checkout
      ? amplitudeEvents.ENABLED
      : amplitudeEvents.DISABLED;

    this.downloadEventProperties = {
      check_out_status,
      source_id: this.event.encrypted_id,
      sub_menu_name: this.cpTracking.activatedRoute(RouteLevel.second),
      assessment_type: this.utils.getEventCategoryType(this.event.store_category)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_DOWNLOAD_EVENT_ASSESS_DATA,
      this.downloadEventProperties
    );
  }

  onFlashMessage(data) {
    this.trackSendMessageEvents(data.hostType);

    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        body: this.cpI18n.translate('announcement_success_sent'),
        autoClose: true
      }
    });
  }

  onComposeTeardown() {
    $('#sendMessageModal').modal('hide');
    this.messageData = null;
    this.isSendMessageModal = false;
  }

  messageAllAttendees() {
    this.allStudents = true;

    const userIds = this.attendees
      .filter((attendee) => attendee.user_id)
      .map((attendee) => attendee.user_id);

    this.messageData = {
      userIds,
      name: this.event.title,
      storeId: this.event.store_id
    };

    this.loadModal();
  }

  messageAttendee(attendee) {
    if (!this.canMessage) {
      return;
    }

    this.allStudents = false;

    this.messageData = {
      userIds: [attendee.user_id],
      storeId: this.event.store_id,
      name: `${attendee.firstname} ${attendee.lastname}`
    };

    this.loadModal();
  }

  loadModal() {
    this.isSendMessageModal = true;
    setTimeout(
      () => {
        $('#sendMessageModal').modal();
      },

      1
    );
  }

  onAddCheckIn() {
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

  trackSendMessageEvents(host_type) {
    const engagement_type = this.allStudents
      ? amplitudeEvents.ALL_STUDENTS
      : amplitudeEvents.SINGLE_STUDENT;

    this.eventProperties = {
      ...this.eventProperties,
      host_type,
      engagement_type,
      announcement_source: amplitudeEvents.EVENT_ASSESSMENT,
      sub_menu_name: this.cpTracking.activatedRoute(RouteLevel.second)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_SENT_ANNOUNCEMENT,
      this.eventProperties
    );
  }

  onCreated(checkedInData: ICheckIn) {
    this.isAddCheckInModal = false;
    this.fetchAttendees();

    const hasCheckOut = checkedInData.check_out_time_epoch > 0;
    const check_out = hasCheckOut ? CheckInOut.yes : CheckInOut.no;
    const eventProperties = {
      ...this.checkInEventProperties,
      check_out
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_ADDED_ATTENDANCE,
      eventProperties);
  }

  onEdited(checkInOut) {
    this.checkInData = null;
    this.isEditCheckInModal = false;
    this.fetchAttendees();

    const eventProperties = {
      ...this.checkInEventProperties,
      check_in: checkInOut.checkIn,
      check_out: checkInOut.checkOut
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_UPDATED_ATTENDANCE,
      eventProperties);
  }

  onDeleted(id: number) {
    this.checkInData = null;
    this.isDeleteCheckInModal = false;

    this.attendees = this.attendees.filter((attendee) => attendee.id !== id);

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_DELETED_ATTENDANCE,
      this.checkInEventProperties);

    if (this.attendees.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetchAttendees();
    }
  }

  onToggleQr(isEnabled: boolean) {
    const verificationMethods = this.event.attend_verification_methods;

    if (!isEnabled && !verificationMethods.includes(CheckInMethod.app)) {
      verificationMethods.push(CheckInMethod.app);
    } else if (isEnabled && verificationMethods.includes(CheckInMethod.app)) {
      verificationMethods.pop(CheckInMethod.app);
    }

    const data = {
      ...this.event,
      attend_verification_methods: verificationMethods
    };

    this.updateQrCode.next(verificationMethods);

    let search = new HttpParams();
    if (this.orientationId) {
      search = search
        .append('school_id', this.session.g.get('school').id)
        .append('calendar_id', this.orientationId.toString());
    }

    this.service.updateEvent(data, this.eventId, search).subscribe(
      (res) => {
        this.event = res;
        this.trackQrCode(this.event);
        this.onSuccessQRCheckInMessage(isEnabled);
      },
      (_) => {
        this.onErrorQRCheckInMessage();
      }
    );
  }

  onSuccessQRCheckInMessage(isEnabled: boolean) {
    const message = isEnabled
      ? 't_event_assessment_qr_code_disabled_success_message'
      : 't_event_assessment_qr_code_enable_success_message';

    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        body: this.cpI18n.translate(message),
        autoClose: true,
        class: 'success'
      }
    });
  }

  onErrorQRCheckInMessage() {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        class: 'danger',
        body: this.cpI18n.translate('something_went_wrong'),
        autoClose: true
      }
    });
  }

  onTrackClickCheckinEvent(event: IEvent) {
    const eventProperties = {
      source_id: event.encrypted_id,
      sub_menu_name: this.cpTracking.activatedRoute(RouteLevel.second),
      assessment_type: this.utils.getEventCategoryType(event.store_category)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_CC_WEB_CHECK_IN,
      eventProperties
    );
  }

  trackQrCode(event) {
    const eventProperties = {
      ...this.utils.getQRCodeCheckOutStatus(event, true),
      source_id: this.event.encrypted_id,
      sub_menu_name: this.cpTracking.activatedRoute(RouteLevel.second),
      assessment_type: this.utils.getEventCategoryType(this.event.store_category)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_CHANGED_QR_CODE, eventProperties);
  }

  setCheckInEventProperties() {
    this.checkInEventProperties = {
      ...this.utils.getQRCodeCheckOutStatus(this.event, true),
      source_id: this.event.encrypted_id,
      sub_menu_name: this.cpTracking.activatedRoute(RouteLevel.second),
      assessment_type: this.utils.getEventCategoryType(this.event.store_category)
    };
  }

  ngOnInit() {
    this.urlPrefix = this.utils.buildUrlPrefix(this.getEventType());

    this.sortingLabels = {
      name: this.cpI18n.translate('name'),
      rating: this.cpI18n.translate('rating'),
      method: this.cpI18n.translate('events_checked_in_method')
    };

    this.canMessage = canSchoolWriteResource(
      this.session.g,
      CP_PRIVILEGES_MAP.campus_announcements
    );

    const attendancePrivilege =
      this.athleticId === isClubAthletic.athletic
        ? CP_PRIVILEGES_MAP.athletics
        : this.isOrientation
          ? CP_PRIVILEGES_MAP.orientation
          : this.isService
            ? CP_PRIVILEGES_MAP.services
            : this.isClub ? CP_PRIVILEGES_MAP.clubs : CP_PRIVILEGES_MAP.event_attendance;
    this.showStudentIds =
      canSchoolReadResource(this.session.g, attendancePrivilege) && this.session.hasSSO;

    this.messageAttendeesTooltipText = !this.canMessage
      ? this.cpI18n.translate('t_events_attendance_no_permission_tooltip_text')
      : '';

    this.fetch();
  }
}
