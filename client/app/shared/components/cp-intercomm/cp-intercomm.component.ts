import { Component, OnInit } from '@angular/core';

declare var window: any;

import { CPSession } from '../../../session';

@Component({
  selector: 'cp-intercomm',
  templateUrl: './cp-intercomm.component.html',
})
export class CPIntercommComponent implements OnInit {
  constructor(
    private session: CPSession
  ) { }

  ngOnInit() {
    window.Intercom('boot', {
      app_id: 'v0k6hr06',
      user_id: this.session.user.id,
      email: this.session.user.email,
    });
  }
}
