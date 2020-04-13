import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { getHeaderState } from '../../../store';
import { baseActions, IHeader } from './../../../store/base';

@Component({
  selector: 'cp-assess',
  template: `
    <cp-page-header [data]="headerData$ | async"></cp-page-header>
    <div class="cp-wrapper cp-wrapper--outer">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AssessComponent implements OnInit {
  headerData$: Observable<IHeader>;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    Promise.resolve().then(() => {
      this.headerData$ = this.store.select(getHeaderState);
    });

    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: require('./assess.header.json')
    });
  }
}
