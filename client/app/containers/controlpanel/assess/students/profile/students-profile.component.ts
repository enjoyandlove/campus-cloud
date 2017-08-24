import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { StudentsService } from './../students.service';
import { CPSession } from './../../../../../session/index';
import { CPDate } from './../../../../../shared/utils/date';
import { FORMAT } from './../../../../../shared/pipes/date.pipe';
import { STATUS } from './../../../../../shared/constants/status';
import { BaseComponent } from './../../../../../base/base.component';
import { HEADER_UPDATE } from './../../../../../reducers/header.reducer';
import { SNACKBAR_SHOW } from './../../../../../reducers/snackbar.reducer';
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

@Component({
  selector: 'cp-students-profile',
  templateUrl: './students-profile.component.html',
  styleUrls: ['./students-profile.component.scss']
})
export class StudentsProfileComponent extends BaseComponent implements OnInit {

  messageData;
  engagementData = [];
  engagementsByDay = [];
  loadingEngagementData;
  isStudentComposeModal;
  dateFormat = FORMAT.LONG;
  timeFormat = FORMAT.TIME;
  loadingStudentData = true;
  starSize = STAR_SIZE.SMALL;

  constructor(
    private store: Store<any>,
    private session: CPSession,
    private service: StudentsService
  ) {
    super();
    super.isLoading().subscribe(loading => this.loadingEngagementData = loading);

    this.fetchStudentData();
  }

  fetchStudentData() {
    setTimeout(() => {
      this.buildHeader({
        firstname: 'Peter',
        lastname: 'Cen'
      });

      this.loadingStudentData = false;

      this.fetch();
    }, 1700)
  }

  fetch() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    const stream$ = this.service.getEngagements(search, this.startRange, this.endRange);

    super
      .fetchData(stream$)
      .then(res => {
        this.engagementData = res.data.reduce((result, current) => {
          if (isSameDay(current.epoch_time, current.epoch_time)) {
            if (setTimeDataToZero(current.epoch_time) in result) {
              result[setTimeDataToZero(current.epoch_time)] = [
                ...result[setTimeDataToZero(current.epoch_time)],
                current
              ]
            } else {
              result[setTimeDataToZero(current.epoch_time)] = [current]
            }
          } else {
            result[setTimeDataToZero(current.epoch_time)] = [current]
          }
          return result;
        }, {})

        this.engagementsByDay = Object.keys(this.engagementData);
      })
      .catch(err => console.log(err))
  }

  onFilter(filterBy) {
    console.log('filtering by', filterBy);
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
    console.log('doing download');
  }

  onComposeTeardown() {
    this.messageData = null;
    this.isStudentComposeModal = false;
  }

  launchMessageModal() {
    this.messageData = {
      name: 'Peter Cen',
      userIds: [16776]
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

  ngOnInit() { }
}
