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
    let schooldId = this.session.school.id;
    let privileges = require('./manage.header.json');

    privileges = Object.assign(
      {},
      privileges,
      { children:  privileges.children.filter(p =>
        this.user.school_level_privileges[schooldId] === p.privilege)
      }
    );

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: privileges
    });
  }
}
