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
      'heading': `Good Afternoon, ${this.user.firstname} ${this.user.lastname}`,
      'subheading': 'Welcome back to your account dashboard',
      'children': [
        {
          'label': 'Overview',
          'url': '/dashboard'
        }
      ]
    };
  }

  ngOnInit() { }
}
