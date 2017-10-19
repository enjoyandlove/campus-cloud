import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CPSession } from '../../../session';
import { appStorage } from '../../../shared/utils';

@Component({
  selector: 'cp-logout',
  template: '',
})
export class LogoutComponent implements OnInit {
  constructor(
    private router: Router,
    private session: CPSession
  ) { }

  ngOnInit() {
    this.session.g.clear();
    appStorage.clear();
    this.router.navigate(['/login']);
  }
}
