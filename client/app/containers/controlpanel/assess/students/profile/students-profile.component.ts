import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { StudentsService } from './../students.service';
import { CPSession } from './../../../../../session/index';
import { CPDate } from './../../../../../shared/utils/date';
import { FORMAT } from './../../../../../shared/pipes/date';
import { STATUS } from './../../../../../shared/constants/status';
import { BaseComponent } from './../../../../../base/base.component';
import { HEADER_UPDATE } from './../../../../../reducers/header.reducer';
import { SNACKBAR_SHOW } from './../../../../../reducers/snackbar.reducer';
import { createSpreadSheet } from './../../../../../shared/utils/csv/parser';
import { STAR_SIZE } from './../../../../../shared/components/cp-stars/cp-stars.component';

import * as moment from 'moment';

declare var $;

const isSameDay = (dateOne, dateTwo): boolean => {
  dateOne = moment(CPDate.fromEpoch(dateOne)).toObject();
  dateTwo = moment(CPDate.fromEpoch(dateTwo)).toObject();

  return dateOne.date === dateTwo.date &&
    dateOne.months === dateTwo.months &&
    dateOne.years === dateTwo.years;
}

const setTimeDataToZero = unixTimeStamp => {
  return CPDate
    .toEpoch(moment(CPDate.fromEpoch(unixTimeStamp))
      .hours(0).minutes(0).seconds(0).toDate())
}

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
  isEvent = 'event';

  state = {
    scope: ALL_ENGAGEMENTS
  }

  constructor(
    private store: Store<any>,
    private session: CPSession,
    private route: ActivatedRoute,
    private service: StudentsService
  ) {
    super();
    super.isLoading().subscribe(loading => this.loadingEngagementData = loading);

    this.studentId = this.route.snapshot.params['studentId'];
  }

  fetchStudentData() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    this
      .service
      .getStudentById(search, this.studentId)
      .subscribe(student => {
        this.student = student;

        this.buildHeader({
          firstname: this.student.firstname,
          lastname: this.student.lastname
        })

        this.loadingStudentData = false;

        this.fetch();
      });
  }

  fetch() {
    const search = new URLSearchParams();
    search.append('scope', this.state.scope.toString());
    search.append('school_id', this.session.g.get('school').id.toString());

    const stream$ = this
      .service.getEngagements(search, this.studentId, this.startRange, this.endRange);

    super
      .fetchData(stream$)
      .then(res => {
        this.engagementData = res.data.reduce((result, current) => {
          if (isSameDay(current.time_epoch, current.time_epoch)) {
            if (setTimeDataToZero(current.time_epoch) in result) {
              result[setTimeDataToZero(current.time_epoch)] = [
                ...result[setTimeDataToZero(current.time_epoch)],
                current
              ]
            } else {
              result[setTimeDataToZero(current.time_epoch)] = [current]
            }
          } else {
            result[setTimeDataToZero(current.time_epoch)] = [current]
          }
          return result;
        }, {})

        this.engagementsByDay = Object.keys(this.engagementData).reverse();
      })
      .catch(err => { throw new Error(err) })
  }

  onFilter(scope) {
    this.state = Object.assign(
      {},
      this.state,
      { scope }
    );

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
      type: HEADER_UPDATE,
      payload:
      {
        'heading': `${student.firstname} ${student.lastname}`,
        'subheading': null,
        'em': null,
        'children': []
      }
    });
  }

  onDownload() {
    const search = new URLSearchParams();
    search.append('scope', this.state.scope.toString());
    search.append('all', DOWNLOAD_ALL_RECORDS.toString());
    search.append('school_id', this.session.g.get('school').id.toString());

    const stream$ = this
      .service.getEngagements(search, this.studentId, this.startRange, this.endRange);

    const columns = [
      'Check-In Item',
      'Type',
      'Check-In Date',
      'Response Date',
      'Rating',
      'Response',
    ];

    const type = {
      'event': 'Event',
      'service': 'Service'
    };

    stream$
      .toPromise()
      .then(data => {
        data = data.map(item => {
          return {
            'Check-In Item': item.name,

            'Type': type[item.type],

            'Check-In Date': moment.unix(item.time_epoch).format('MMMM Do YYYY - h:mm a'),

            'Response Date': item.feedback_time_epoch === 0 ?
              'No Feedback Provided' :
              moment.unix(item.feedback_time_epoch).format('MMMM Do YYYY - h:mm a'),

            'Rating': item.user_rating_percent === -1 ?
              'No Rating Provided' :
              ((item.user_rating_percent / 100) * 5).toFixed(1)
            ,

            'Response': item.user_feedback_text,
          }
        })

        createSpreadSheet(data, columns, `${this.student.firstname} ${this.student.lastname}`)
      })
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
    setTimeout(() => { $('#studentsComposeModal').modal(); }, 1);
  }

  onFlashMessage() {
    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        body: STATUS.MESSAGE_SENT,
        autoClose: true,
      }
    });
  }

  ngOnInit() {
    this.fetchStudentData();
  }
}
