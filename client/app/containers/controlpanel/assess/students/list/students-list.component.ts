import { StudentListFilter } from './../students.status';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { StudentsService } from './../students.service';
import { FORMAT } from '../../../../../shared/pipes/date';
import { CPSession } from './../../../../../session/index';
import { AssessUtilsService } from '../../assess.utils.service';
import { CPTrackingService } from '../../../../../shared/services';
import { BaseComponent } from './../../../../../base/base.component';
import { CP_TRACK_TO } from '../../../../../shared/directives/tracking';
import { HEADER_UPDATE } from './../../../../../reducers/header.reducer';
import { SNACKBAR_SHOW } from './../../../../../reducers/snackbar.reducer';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

interface IState {
  search_str: string;
  audience_id: number;
  experience_id: number;
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
    audience_id: null,
    experience_id: null,
    sort_field: 'firstname',
    sort_direction: 'asc'
  };

  eventProperties = {
    host_type: null,
    engagement_type: null
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
    private service: StudentsService,
    public utils: AssessUtilsService,
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
    const audience_id = this.state.audience_id ? this.state.audience_id.toString() : null;
    const experience_id = this.state.experience_id ? this.state.experience_id.toString() : null;

    let search = new HttpParams().set('school_id', this.session.g.get('school').id.toString());

    if (this.state.search_str) {
      search = search.set('search_str', this.state.search_str);
    }

    if (this.state.sort_field) {
      search = search.set('sort_field', this.state.sort_field);
    }

    if (this.state.sort_direction) {
      search = search.set('sort_direction', this.state.sort_direction);
    }

    if (audience_id) {
      search = search.set('user_list_id', audience_id);
    }

    if (experience_id) {
      search = search.set('persona_id', experience_id);
    }

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
        list_id: this.state.audience_id,
        experience_id: this.state.experience_id
      }
    });
  }

  onFlashMessage(data) {
    this.trackAmplitudeEvents(data.hostType);

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

  onFilter(filter) {
    this.resetPagination();

    const { filterBy } = filter;

    const isAudience = filterBy ? filterBy.queryParam === StudentListFilter.audienceId : null;
    const isExperience = filterBy ? filterBy.queryParam === StudentListFilter.experienceId : null;

    this.state = {
      ...this.state,
      search_str: filter.search_str,
      audience_id: isAudience ? filterBy.id : null,
      experience_id: isExperience ? filterBy.id : null
    };

    this.updateUrl();

    this.fetch();
  }

  trackAmplitudeEvents(host_type) {
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
    this.fetch();

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../../assess.header.json')
    });

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties: this.cpTracking.getEventProperties()
    };
  }
}
