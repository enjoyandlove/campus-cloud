import { Component, OnInit, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/index';
import { get as _get } from 'lodash';
import { Store } from '@ngrx/store';

import IEvent from '../event.interface';
import { EventsService } from '../events.service';
import { FORMAT } from '@campus-cloud/shared/pipes';
import { CPSession, IUser } from '@campus-cloud/session';
import { ICheckIn } from './check-in/check-in.interface';
import { IHeader, baseActions } from '@campus-cloud/store';
import { EventUtilService } from './../events.utils.service';
import { EventsComponent } from '../list/base/events.component';
import { isClubAthletic } from '../../clubs/clubs.athletics.labels';
import { EventsAmplitudeService } from '../events.amplitude.service';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import { IStudentFilter } from '../../../assess/engagement/engagement.utils.service';
import { CheckInMethod, CheckInOutTime, CheckInOut, AttendeeType } from '../event.status';
import { canSchoolReadResource, canSchoolWriteResource } from '@campus-cloud/shared/utils';
import { ModalService, CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { CP_PRIVILEGES_MAP, amplitudeEvents, SortDirection } from '@campus-cloud/shared/constants';

interface IState {
  sortField: string;
  searchText: string;
  sortDirection: SortDirection;
  studentFilter: IStudentFilter;
}

const state: IState = {
  searchText: null,
  studentFilter: null,
  sortField: 'firstname',
  sortDirection: SortDirection.ASC
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
  subMenuName;
  sortingLabels;
  attendees = [];
  loading = true;
  showStudentIds;
  eventId: number;
  allStudents = false;
  state: IState = state;
  summaryLoading = false;
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
  deletedAttendee = AttendeeType.deleted;
  emptyCheckOutTime = CheckInOutTime.empty;
  updateQrCode = new BehaviorSubject(null);
  totalAttendees = new BehaviorSubject(null);
  defaultImage = `${environment.root}assets/default/user.png`;

  eventProperties = {
    host_type: null,
    sub_menu_name: null,
    engagement_type: null,
    announcement_source: null
  };

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<IHeader>,
    private route: ActivatedRoute,
    public service: EventsService,
    public utils: EventUtilService,
    public modalService: ModalService,
    public cpTracking: CPTrackingService
  ) {
    super(session, cpI18n, service, modalService, store);
    this.eventId = this.route.snapshot.params['eventId'];
    super.isLoading().subscribe((res) => (this.attendeesLoading = res));
  }

  public fetch() {
    let search = new HttpParams();

    if (this.orientationId) {
      search = search
        .set('school_id', this.session.g.get('school').id)
        .set('calendar_id', this.orientationId.toString());
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

  updateAssessment() {
    this.fetchAttendees();
    if (!this.state.searchText) {
      this.fetchAttendanceSummary();
    }
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
    const search = this.getAttendeesSearch();

    this.attendeesLoading = true;
    this.service
      .getEventAttendanceByEventId(this.startRange, this.endRange, search)
      .subscribe((res: IUser[]) => {
        this.attendeesLoading = false;
        this.attendees = res;
        this.totalAttendees.next(res);
        this.updatePagination(res);
      });
  }

  fetchAttendanceSummary() {
    let search = new HttpParams();

    search = this.addStudentFilter(search);

    this.summaryLoading = true;
    this.service.getEventById(this.eventId, search).subscribe((res: any) => {
      this.summaryLoading = false;
      this.event = { ...this.event, ...res };
    });
  }

  getAttendeesSearch() {
    let search = new HttpParams();

    search = search
      .set('event_id', this.event.id)
      .set('sort_field', this.state.sortField)
      .set('search_text', this.state.searchText)
      .set('sort_direction', this.state.sortDirection);

    search = this.addStudentFilter(search);

    return search;
  }

  addStudentFilter(search: HttpParams) {
    if (this.orientationId) {
      search = search
        .set('school_id', this.session.g.get('school').id)
        .set('calendar_id', this.orientationId.toString());
    }

    if (search && this.state.studentFilter) {
      if (this.state.studentFilter.listId) {
        search = search.set('user_list_id', this.state.studentFilter.listId.toString());
      } else if (this.state.studentFilter.personaId) {
        search = search.set('persona_id', this.state.studentFilter.personaId.toString());
      }
    }
    return search;
  }

  onPaginationNext() {
    super.goToNext();
    this.fetchAttendees();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetchAttendees();
  }

  doSort(sortField) {
    const sortDirection =
      this.state.sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
    this.state = {
      ...this.state,
      sortField,
      sortDirection
    };
    this.fetchAttendees();
  }

  checkInMethodType(method) {
    return method === CheckInMethod.web ? 'computer' : 'smartphone';
  }

  doSearch(searchText): void {
    searchText = searchText === '' ? null : searchText;
    this.state = { ...this.state, searchText };
    this.resetPagination();
    this.updateAssessment();
  }

  onStudentFilter(studentFilter: IStudentFilter) {
    this.state = { ...this.state, studentFilter };
    this.resetPagination();
    this.updateAssessment();
  }

  onCreateExcel() {
    const search = this.getAttendeesSearch().set('all', '1');

    const stream$ = this.service.getEventAttendanceByEventId(
      this.startRange,
      this.endRange,
      search
    );

    this.trackAmplitudeEvent();

    this.utils.createExcel(stream$, this.showStudentIds, this.event);
  }

  trackAmplitudeEvent() {
    const assessment_status = this.event.has_checkout
      ? amplitudeEvents.CHECKIN_AND_CHECKOUT
      : amplitudeEvents.CHECKIN_ONLY;

    const feedback_status = this.event.event_feedback
      ? amplitudeEvents.ENABLED
      : amplitudeEvents.DISABLED;

    const filter_type = _get(
      this.state,
      ['studentFilter', 'cohort_type'],
      amplitudeEvents.ALL_STUDENTS
    );

    this.downloadEventProperties = {
      filter_type,
      feedback_status,
      assessment_status,
      source_id: this.event.encrypted_id,
      sub_menu_name: this.subMenuName,
      assessment_type: EventsAmplitudeService.getEventCategoryType(this.event.store_category)
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
        $('#sendMessageModal').modal({ keyboard: true, focus: true });
      },

      1
    );
  }

  onAddCheckIn() {
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

  trackSendMessageEvents(host_type) {
    const engagement_type = this.allStudents
      ? amplitudeEvents.ALL_STUDENTS
      : amplitudeEvents.SINGLE_STUDENT;

    this.eventProperties = {
      ...this.eventProperties,
      host_type,
      engagement_type,
      announcement_source: amplitudeEvents.EVENT_ASSESSMENT,
      sub_menu_name: this.subMenuName
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

    this.event = {
      ...this.event,
      verified_checkins: this.event.verified_checkins + 1
    };
    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_ADDED_ATTENDANCE, eventProperties);
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

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_UPDATED_ATTENDANCE, eventProperties);
  }

  onDeleted(id: number) {
    this.checkInData = null;
    this.isDeleteCheckInModal = false;

    this.attendees = this.attendees.filter((attendee) => attendee.id !== id);

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_DELETED_ATTENDANCE,
      this.checkInEventProperties
    );

    this.event = {
      ...this.event,
      verified_checkins: this.event.verified_checkins - 1
    };

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
        .set('school_id', this.session.g.get('school').id)
        .set('calendar_id', this.orientationId.toString());
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
      sub_menu_name: this.subMenuName,
      assessment_type: EventsAmplitudeService.getEventCategoryType(event.store_category)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_CC_WEB_CHECK_IN, eventProperties);
  }

  trackQrCode(event) {
    const eventProperties = {
      ...EventsAmplitudeService.getQRCodeCheckOutStatus(event, true),
      source_id: this.event.encrypted_id,
      sub_menu_name: this.subMenuName,
      assessment_type: EventsAmplitudeService.getEventCategoryType(this.event.store_category)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_CHANGED_QR_CODE, eventProperties);
  }

  setCheckInEventProperties() {
    this.checkInEventProperties = {
      ...EventsAmplitudeService.getQRCodeCheckOutStatus(this.event, true),
      source_id: this.event.encrypted_id,
      sub_menu_name: this.subMenuName,
      assessment_type: EventsAmplitudeService.getEventCategoryType(this.event.store_category)
    };
  }

  ngOnInit() {
    const menus = this.cpTracking.getAmplitudeMenuProperties();
    this.subMenuName = menus['sub_menu_name'];

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
        : this.isClub
        ? CP_PRIVILEGES_MAP.clubs
        : CP_PRIVILEGES_MAP.event_attendance;
    this.showStudentIds =
      canSchoolReadResource(this.session.g, attendancePrivilege) && this.session.hasSSO;

    this.messageAttendeesTooltipText = !this.canMessage
      ? this.cpI18n.translate('t_events_attendance_no_permission_tooltip_text')
      : '';

    this.fetch();
  }
}
