import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { StudentsService } from './../students.service';
import { CPSession } from './../../../../../session/index';
import { FORMAT } from './../../../../../shared/pipes/date';
import { BaseComponent } from './../../../../../base/base.component';
import { HEADER_UPDATE } from './../../../../../reducers/header.reducer';
import { SNACKBAR_SHOW } from './../../../../../reducers/snackbar.reducer';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

interface IState {
  search_str: string;
  user_list_id: number;
}

declare var $;

@Component({
  selector: 'cp-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss'],
})
export class StudentsListComponent extends BaseComponent implements OnInit {
  loading;
  students = [];

  state: IState = {
    search_str: null,
    user_list_id: null,
  };
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
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  fetch() {
    const search = new URLSearchParams();
    const user_list_id = this.state.user_list_id
      ? this.state.user_list_id.toString()
      : null;

    search.append('school_id', this.session.g.get('school').id.toString());
    search.append('search_str', this.state.search_str);
    search.append('user_list_id', user_list_id);

    const stream$ = this.service.getStudentsByList(
      search,
      this.startRange,
      this.endRange,
    );

    super
      .fetchData(stream$)
      .then((res) => (this.students = res.data))
      .catch((err) => {
        throw new Error(err);
      });
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
        list_id: this.state.user_list_id,
      },
    });
  }

  readStateFromUrl() {
    this.state = Object.assign({}, this.state, {
      user_list_id: this.route.snapshot.queryParams['list_id'],
    });

    this.fetch();
  }

  onFlashMessage() {
    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        body: this.cpI18n.translate('announcement_success_sent'),
        autoClose: true,
      },
    });
  }

  onComposeTeardown() {
    this.messageData = null;
    this.isStudentComposeModal = false;
  }

  messageStudent(student) {
    this.messageData = {
      name: `${student.firstname} ${student.lastname}`,
      userIds: [student.id],
    };

    this.isStudentComposeModal = true;
    setTimeout(
      () => {
        $('#studentsComposeModal').modal();
      },

      1,
    );
  }

  onFilter(filterBy) {
    this.state = Object.assign({}, this.state, {
      search_str: filterBy.search_str,
      user_list_id: filterBy.list_id,
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
      payload: require('../../assess.header.json'),
    });

    if ('list_id' in this.route.snapshot.queryParams) {
      this.listIdFromUrl = this.route.snapshot.queryParams['list_id'];
      this.readStateFromUrl();
    }
  }
}
