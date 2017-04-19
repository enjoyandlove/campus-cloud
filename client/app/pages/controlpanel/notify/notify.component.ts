import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../reducers/header.reducer';

@Component({
  selector: 'cp-notify',
  template: `
  <cp-page-header [data]="headerData$ | async"></cp-page-header>
  <div class="container">
    <router-outlet></router-outlet>
  </div>
  `,
})
export class NotifyComponent implements OnInit {
  headerData$: Observable<IHeader>;

  constructor(private store: Store<IHeader>) {
    this.headerData$ = this.store.select('HEADER');

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('./notify.header.json')
    });
  }

  ngOnInit() {}
}
