import { Component, OnInit } from '@angular/core';

import { CPSession } from '../../../session';

@Component({
  selector: 'cp-topbar',
  templateUrl: './cp-topbar.component.html',
  styleUrls: ['./cp-topbar.component.scss']
})
export class CPTopBarComponent implements OnInit {
  user;
  school;

  constructor(
    private session: CPSession
  ) { }

  ngOnInit() {
    this.user = this.session.user;
    this.school = this.session.school;

    console.log(this.session.user);
    console.log(this.session.school);
  }
}
