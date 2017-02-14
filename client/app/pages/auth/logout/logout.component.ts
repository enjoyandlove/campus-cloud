import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { appStorage } from '../../../shared/utils';

@Component({
  selector: 'cp-logout',
  template: '',
})
export class LogoutComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() {
    appStorage.clear();
    this.router.navigate(['/login']);
  }
}
