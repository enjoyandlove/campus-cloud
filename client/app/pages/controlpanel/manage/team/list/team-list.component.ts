import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent implements OnInit {

  constructor(
    private store: Store<IHeader>
  ) { }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../team.header.json')
    });
  }

  ngOnInit() {
    this.buildHeader();
  }
}
