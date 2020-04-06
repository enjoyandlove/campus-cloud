import { StudentListFilter } from '../students.status';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { StudentsService } from '../students.service';
import { baseActions } from '@campus-cloud/store/base';
import { FORMAT } from '@campus-cloud/shared/pipes/date';
import { CPI18nService } from '@campus-cloud/shared/services';
import { CP_TRACK_TO } from '@campus-cloud/shared/directives';
import { AssessUtilsService } from '../../assess.utils.service';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService, UserService } from '@campus-cloud/shared/services';
import { environment } from '@projects/campus-cloud/src/environments/environment';

interface IState {
  search_str: string;
  audience_id: number;
  muted: boolean;
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
    muted: false,
    search_str: null,
    audience_id: null,
    experience_id: null,
    sort_field: 'username',
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
  defaultImage = `${environment.root}assets/default/user.png`;

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

    search = search.set('search_str', this.state.search_str);
    search = search.set('sort_field', this.state.sort_field);
    search = search.set('sort_direction', this.state.sort_direction);
    search = search.set('user_list_id', audience_id);
    search = search.set('persona_id', experience_id);
    if (this.state.muted) {
      search = search.set('social_restriction', '1');
    }

    const stream$ = this.service.getStudentsByList(search, this.startRange, this.endRange).pipe(
      catchError(() => {
        const data = [];
        return of({ data });
      })
    );

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
      type: baseActions.SNACKBAR_SHOW,
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
        $('#studentsComposeModal').modal({ keyboard: true, focus: true });
      },

      1
    );
  }

  onFilter(filter) {
    this.resetPagination();

    const { filterBy } = filter;

    const isAudience = filterBy ? filterBy.queryParam === StudentListFilter.audienceId : null;
    const isExperience = filterBy ? filterBy.queryParam === StudentListFilter.experienceId : null;
    const { muted, search_str } = filter;

    this.state = {
      ...this.state,
      muted,
      search_str,
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

    Promise.resolve().then(() => {
      this.store.dispatch({
        type: baseActions.HEADER_UPDATE,
        payload: require('../../assess.header.json')
      });
    });

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties: this.cpTracking.getAmplitudeMenuProperties()
    };
  }
}
