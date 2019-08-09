import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as apiHeader from './api-management.header.json';
import { IHeader, baseActions, getHeaderState } from '@campus-cloud/store';

@Component({
  selector: 'cp-api-management',
  template: `
    <cp-page-header [data]="headerData$ | async"></cp-page-header>
    <div class="cp-wrapper cp-wrapper--outer">
      <router-outlet></router-outlet>
    </div>
  `
})
export class ApiManagementComponent implements OnInit {
  headerData$: Observable<IHeader>;

  constructor(private store: Store<any>) {
    this.headerData$ = this.store.select(getHeaderState);

    this.store.dispatch({
      payload: apiHeader,
      type: baseActions.HEADER_UPDATE
    });
  }

  ngOnInit() {}
}
