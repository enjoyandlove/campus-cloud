import { URLSearchParams } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { StudentsService } from './../students.service';
import { CPSession } from './../../../../../session/index';
import { FORMAT } from './../../../../../shared/pipes/date.pipe';
import { STATUS } from './../../../../../shared/constants/status';
import { BaseComponent } from './../../../../../base/base.component';
import { HEADER_UPDATE } from './../../../../../reducers/header.reducer';
import { SNACKBAR_SHOW } from './../../../../../reducers/snackbar.reducer';

interface IState {
  search_str: string,
  user_list_id: number
}

declare var $;

@Component({
  selector: 'cp-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent extends BaseComponent implements OnInit {
  loading;
  students = [];

  state: IState = {
    search_str: null,
    user_list_id: null,
  }
  messageData;
  dateFormat = FORMAT.DATETIME;
  isStudentComposeModal = false;
  avatarCustomCodeThreshold = 3;
  defaultImage = require('public/default/user.png');

  constructor(
    private store: Store<any>,
    private session: CPSession,
    private service: StudentsService
  ) {
    super();
    super.isLoading().subscribe(loading => this.loading = loading);
  }

  fetch() {
    const search = new URLSearchParams();
    const user_list_id = this.state.user_list_id ? this.state.user_list_id.toString() : null;

    search.append('school_id', this.session.school.id.toString());
    search.append('search_str', this.state.search_str);
    search.append('user_list_id', user_list_id);

    const stream$ = this.service.getStudentsByList(search, this.startRange, this.endRange);

    super
      .fetchData(stream$)
      .then(res => this.students = res.data)
      .catch(err => { throw new Error(err) });

  }

  onPaginationNext(): void {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious(): void {
    super.goToPrevious();
    this.fetch();
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

  onComposeTeardown() {
    this.messageData = null;
    this.isStudentComposeModal = false;
  }

  messageStudent(student) {
    this.messageData = {
      name: `${student.firstname} ${student.lastname}`,
      userIds: [student.id]
    };

    this.isStudentComposeModal = true;
    setTimeout(() => { $('#studentsComposeModal').modal(); }, 1);
  }

  onFilter(filterBy) {
    this.state = Object.assign(
      {},
      this.state,
      {
        search_str: filterBy.search_str,
        user_list_id: filterBy.list_id,
      }
    )
    this.fetch();
  }

  ngOnInit() {
    this.fetch();

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../../assess.header.json')
    });
  }
}
