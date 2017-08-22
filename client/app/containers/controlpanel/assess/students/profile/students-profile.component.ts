import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { StudentsService } from './../students.service';
import { CPSession } from './../../../../../session/index';
import { FORMAT } from './../../../../../shared/pipes/date.pipe';
import { BaseComponent } from './../../../../../base/base.component';
import { HEADER_UPDATE } from './../../../../../reducers/header.reducer';
import { STAR_SIZE } from './../../../../../shared/components/cp-stars/cp-stars.component';

@Component({
  selector: 'cp-students-profile',
  templateUrl: './students-profile.component.html',
  styleUrls: ['./students-profile.component.scss']
})
export class StudentsProfileComponent extends BaseComponent implements OnInit {
  loading;
  engagements = [];
  engagementsArray = [];
  dateFormat = FORMAT.LONG;
  timeFormat = FORMAT.TIME;
  starSize = STAR_SIZE.SMALL;

  constructor(
    private store: Store<any>,
    private session: CPSession,
    private service: StudentsService
  ) {
    super();
    super.isLoading().subscribe(loading => this.loading = loading);

    this.fetch();
  }

  fetch() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    const stream$ = this.service.getEngagements(search, this.startRange, this.endRange);

    super
      .fetchData(stream$)
      .then(res => {
        this.engagements = res.data;
        console.log(res.data);
        this.engagementsArray = Object.keys(res.data).map(engagement => engagement);
      })
      .catch(err => console.log(err))
  }

  launchMessageModal() {
    console.log('messaging');
  }

  onFilter(filterBy) {
    console.log('filtering by', filterBy);
  }

  onDownload() {
    console.log('doing download');
  }

  ngOnInit() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload:
      {
        'heading': 'Peter Cen',
        'subheading': null,
        'em': null,
        'children': []
      }
    });
  }
}
