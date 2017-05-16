import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../reducers/header.reducer';

import { CPSession, IUser } from '../../../session';

@Component({
  selector: 'cp-manage',
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit {
  user: IUser;
  headerData$: Observable<IHeader>;

  constructor(
    private session: CPSession,
    private store: Store<IHeader>
  ) {
    this.headerData$ = this.store.select('HEADER');
  }

  ngOnInit() {
    this.user = this.session.user;
    // let schooldId = this.session.school.id;

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('./manage.header.json')
    });
  }
}

// {
//   "privilege": 22,
//   "label": "Clubs & Groups",
//   "url": "/manage/clubs"
// },
// {
//   "privilege": 13,
//   "label": "Cover Photo",
//   "url": "/manage/customization"
// },
// {
//   "privilege": 21,
//   "label": "Locations",
//   "url": "/manage/locations"
// }
