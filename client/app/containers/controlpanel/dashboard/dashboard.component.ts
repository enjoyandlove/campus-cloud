import { Component, OnInit } from '@angular/core';

import { CPSession, IUser } from '../../../session';

@Component({
  selector: 'cp-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  user: IUser;
  headerData;

  constructor(
    private session: CPSession
  ) {
    this.user = this.session.user;
    this.headerData = {
      'heading': `Hello ${this.user.firstname}!`,
      'subheading': null,
      'em': null,
      'children': []
    };
  }

  ngOnInit() { }
}
