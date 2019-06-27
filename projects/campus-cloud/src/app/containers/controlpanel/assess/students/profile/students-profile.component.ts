import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { StudentsService } from './../students.service';
import { CPSession } from './../../../../../session/index';
import { CPDate } from './../../../../../shared/utils/date';
import { FORMAT } from './../../../../../shared/pipes/date';
import { AssessUtilsService } from '../../assess.utils.service';
import { CPTrackingService } from '../../../../../shared/services';
import { BaseComponent } from './../../../../../base/base.component';
import { CheckInOutTime } from '../../../manage/events/event.status';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { baseActions, IHeader, ISnackbar } from './../../../../../store/base';
import { STAR_SIZE } from './../../../../../shared/components/cp-stars/cp-stars.component';

declare var $;

const isSameDay = (dateOne, dateTwo, tz): boolean => {
  dateOne = CPDate.fromEpoch(dateOne, tz).toObject();
  dateTwo = CPDate.fromEpoch(dateTwo, tz).toObject();

  return (
    dateOne.date === dateTwo.date &&
    dateOne.months === dateTwo.months &&
    dateOne.years === dateTwo.years
  );
};

const setTimeDataToZero = (unixTimeStamp, tz) => {
  return CPDate.toEpoch(CPDate.fromEpoch(unixTimeStamp, tz).startOf('day'), tz);
};

const ALL_ENGAGEMENTS = 0;
const DOWNLOAD_ALL_RECORDS = 1;

@Component({
  selector: 'cp-students-profile',
  templateUrl: './students-profile.component.html',
  styleUrls: ['./students-profile.component.scss']
})
export class StudentsProfileComponent extends BaseComponent implements OnInit {
  student;
  studentId;
  messageData;
  engagementData = [];
  engagementsByDay = [];
  loadingEngagementData;
  isStudentComposeModal;
  dateFormat = FORMAT.LONG;
  timeFormat = FORMAT.TIME;
  loadingStudentData = true;
  starSize = STAR_SIZE.SMALL;
  noCheckOutTime = CheckInOutTime.empty;

  state = {
    scope: ALL_ENGAGEMENTS
  };

  eventProperties = {
    host_type: null,
    engagement_type: null
  };

  constructor(
    public session: CPSession,
    public route: ActivatedRoute,
    public cpI18n: CPI18nService,
    public service: StudentsService,
    public utils: AssessUtilsService,
    public cpTracking: CPTrackingService,
    public store: Store<ISnackbar | IHeader>
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loadingEngagementData = loading));

    this.studentId = this.route.snapshot.params['studentId'];
  }

  fetchStudentData() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.service.getStudentById(search, this.studentId).subscribe((student) => {
      this.student = student;

      this.buildHeader({
        firstname: this.student.firstname,
        lastname: this.student.lastname
      });

      this.loadingStudentData = false;

      this.fetch();
    });
  }

  fetch() {
    const search = new HttpParams()
      .append('scope', this.state.scope.toString())
      .append('school_id', this.session.g.get('school').id.toString());

    const stream$ = this.service.getEngagements(
      search,
      this.studentId,
      this.startRange,
      this.endRange
    );

    super.fetchData(stream$).then((res) => {
      const tz = this.session.tz;

      this.engagementData = res.data.reduce(
        (result, current) => {
          if (isSameDay(current.time_epoch, current.time_epoch, tz)) {
            if (setTimeDataToZero(current.time_epoch, tz) in result) {
              result[setTimeDataToZero(current.time_epoch, tz)] = [
                ...result[setTimeDataToZero(current.time_epoch, tz)],
                current
              ];
            } else {
              result[setTimeDataToZero(current.time_epoch, tz)] = [current];
            }
          } else {
            result[setTimeDataToZero(current.time_epoch, tz)] = [current];
          }

          return result;
        },

        {}
      );

      this.engagementsByDay = Object.keys(this.engagementData).reverse();
    });
  }

  onFilter(scope) {
    this.state = Object.assign({}, this.state, { scope });

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

  buildHeader(student) {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: `[NOTRANSLATE]${student.firstname} ${student.lastname}[NOTRANSLATE]`,
        subheading: null,
        crumbs: {
          url: 'students',
          label: 'students'
        },
        em: null,
        children: []
      }
    });
  }

  onDownload() {
    const search = new HttpParams()
      .append('scope', this.state.scope.toString())
      .append('all', DOWNLOAD_ALL_RECORDS.toString())
      .append('school_id', this.session.g.get('school').id.toString());

    const stream$ = this.service.getEngagements(
      search,
      this.studentId,
      this.startRange,
      this.endRange
    );

    this.trackAmplitudeEvents();
    this.utils.createExcel(stream$, this.student);
  }

  trackAmplitudeEvents() {
    const eventProperties = {
      engagement_type: amplitudeEvents.SINGLE_STUDENT
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.ASSESS_DOWNLOAD_DATA, eventProperties);
  }

  onComposeTeardown() {
    this.messageData = null;
    this.isStudentComposeModal = false;
  }

  launchMessageModal() {
    this.messageData = {
      name: `${this.student.firstname} ${this.student.lastname}`,
      userIds: [this.student.id]
    };

    this.isStudentComposeModal = true;
    setTimeout(
      () => {
        $('#studentsComposeModal').modal();
      },

      1
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

  trackSendMessageEvents(host_type) {
    this.eventProperties = {
      ...this.eventProperties,
      host_type,
      engagement_type: amplitudeEvents.SINGLE_STUDENT
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.ASSESS_SENT_ANNOUNCEMENT,
      this.eventProperties
    );
  }

  ngOnInit() {
    this.fetchStudentData();
  }
}
