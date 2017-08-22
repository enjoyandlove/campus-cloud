import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { StudentsService } from './../students.service';
import { CPSession } from './../../../../../session/index';
import { FORMAT } from './../../../../../shared/pipes/date.pipe';
import { BaseComponent } from './../../../../../base/base.component';
import { HEADER_UPDATE } from './../../../../../reducers/header.reducer';
import { SNACKBAR_SHOW } from './../../../../../reducers/snackbar.reducer';
import { STAR_SIZE } from './../../../../../shared/components/cp-stars/cp-stars.component';

declare var $;

@Component({
  selector: 'cp-students-profile',
  templateUrl: './students-profile.component.html',
  styleUrls: ['./students-profile.component.scss']
})
export class StudentsProfileComponent extends BaseComponent implements OnInit {

  messageData;
  engagements = [];
  loadingEngagementData;
  isStudentComposeModal;
  engagementsArray = [];
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
        this.engagements = res.data;
        this.engagementsArray = Object.keys(res.data).map(engagement => engagement);
      })
      .catch(err => console.log(err))
  }

  onFilter(filterBy) {
    console.log('filtering by', filterBy);
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
        body: 'Success! Your message has been sent',
        autoClose: true,
      }
    });
  }

  ngOnInit() { }
}
