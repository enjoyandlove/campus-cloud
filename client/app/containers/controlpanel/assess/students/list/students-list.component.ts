import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { StudentsService } from './../students.service';
import { CPSession } from './../../../../../session/index';
import { FORMAT } from './../../../../../shared/pipes/date';
import { CPTrackingService } from '../../../../../shared/services';
import { BaseComponent } from './../../../../../base/base.component';
import { CP_TRACK_TO } from '../../../../../shared/directives/tracking';
import { HEADER_UPDATE } from './../../../../../reducers/header.reducer';
import { SNACKBAR_SHOW } from './../../../../../reducers/snackbar.reducer';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

interface IState {
  search_str: string;
  user_list_id: number;
  sort_field: string;
  sort_direction: string;
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
    sort_field: 'firstname',
    sort_direction: 'asc'
  };
  eventData;
  messageData;
  listIdFromUrl;
  dateFormat = FORMAT.DATETIME;
  isStudentComposeModal = false;
  avatarCustomCodeThreshold = 3;
  defaultImage = require('public/default/user.png');

  constructor(
    private router: Router,
    private store: Store<any>,
    private session: CPSession,
    public cpI18n: CPI18nService,
    private route: ActivatedRoute,
    private service: StudentsService,
    private cpTracking: CPTrackingService
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };

    this.fetch();
  }

  fetch() {
    const user_list_id = this.state.user_list_id ? this.state.user_list_id.toString() : null;

    const search = new HttpParams()
      .set('school_id', this.session.g.get('school').id.toString())
      .set('search_str', this.state.search_str)
      .set('sort_field', this.state.sort_field)
      .set('sort_direction', this.state.sort_direction)
      .set('user_list_id', user_list_id);

    const stream$ = this.service.getStudentsByList(search, this.startRange, this.endRange);

    super.fetchData(stream$).then((res) => (this.students = res.data));
  }

  onPaginationNext(): void {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious(): void {
    super.goToPrevious();
    this.fetch();
  }

  updateUrl() {
    this.router.navigate(['/assess/students'], {
      queryParams: {
        list_id: this.state.user_list_id
      }
    });
  }

  readStateFromUrl() {
    this.state = Object.assign({}, this.state, {
      user_list_id: this.route.snapshot.queryParams['list_id']
    });

    this.fetch();
  }

  onFlashMessage() {
    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        body: this.cpI18n.translate('announcement_success_sent'),
        autoClose: true
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
    setTimeout(
      () => {
        $('#studentsComposeModal').modal();
      },

      1
    );
  }

  onFilter(filterBy) {
    this.state = Object.assign({}, this.state, {
      search_str: filterBy.search_str,
      user_list_id: filterBy.list_id
    });
    this.updateUrl();

    if (filterBy.search_str) {
      this.resetPagination();
    }

    this.fetch();
  }

  ngOnInit() {
    this.fetch();

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../../assess.header.json')
    });

    if ('list_id' in this.route.snapshot.queryParams) {
      this.listIdFromUrl = this.route.snapshot.queryParams['list_id'];
      this.readStateFromUrl();
    }

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties: this.cpTracking.getEventProperties()
    };
  }
}
