import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IHeader, baseActions, getHeaderState } from '../../../store/base';

@Component({
  selector: 'cp-notify',
  template: `
    <cp-page-header [data]="headerData$ | async"></cp-page-header>
    <div class="cp-wrapper cp-wrapper--outer">
      <router-outlet></router-outlet>
    </div>
  `
})
export class NotifyComponent implements OnInit {
  headerData$: Observable<IHeader | {}>;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.headerData$ = this.store.select(getHeaderState);
    Promise.resolve().then(() => {
      this.store.dispatch({
        type: baseActions.HEADER_UPDATE,
        payload: require('./notify.header.json')
      });
    });
  }
}
