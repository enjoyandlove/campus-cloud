import { URLSearchParams } from '@angular/http';
import { Component, OnInit } from '@angular/core';

import { StudentsService } from './../students.service';
import { CPSession } from './../../../../../session/index';
import { FORMAT } from './../../../../../shared/pipes/date.pipe';
import { BaseComponent } from './../../../../../base/base.component';

interface IState {
  search_str: string,
  list_id: number
}

@Component({
  selector: 'cp-engagement-students-list',
  templateUrl: './engagement-students-list.component.html',
  styleUrls: ['./engagement-students-list.component.scss']
})
export class EngagementStudentsListComponent extends BaseComponent implements OnInit {
  loading;
  students = [];
  state: IState = {
    search_str: null,
    list_id: null,
  }

  dateFormat = FORMAT.DATETIME

  constructor(
    private session: CPSession,
    private service: StudentsService
  ) {
    super();
    super.isLoading().subscribe(loading => this.loading = loading);
  }

  fetch() {
    const search = new URLSearchParams();
    const list_id =  this.state.list_id ? this.state.list_id.toString() : null;

    search.append('school_id', this.session.school.id.toString());
    search.append('search_str', this.state.search_str);
    search.append('list_id', list_id);

    const stream$ = this.service.getStudentsByList(search, this.startRange, this.endRange);
    super
      .fetchData(stream$)
      .then(res => this.students = res.data)
      .catch(err => console.log(err));

  }

  onPaginationNext(): void {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious(): void {
    super.goToPrevious();
    this.fetch();
  }

  messageStudent(student) {
    console.log('messaging ', student);
  }

  onFilter(filterBy) {
    this.state = Object.assign(
      {},
      this.state,
      {
        search_str: filterBy.search_str,
        list_id: filterBy.list_id,
      }
    )
    this.fetch();
  }

  ngOnInit() {
    this.fetch();
  }
}
