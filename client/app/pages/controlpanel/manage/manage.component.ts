import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../reducers/header.reducer';

@Component({
  selector: 'cp-manage',
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit {
  headerData$: Observable<IHeader>;

  constructor(private store: Store<IHeader>) {
    this.headerData$ = this.store.select('HEADER');

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('./manage.header.json')
    });
  }

  ngOnInit() { }
}
