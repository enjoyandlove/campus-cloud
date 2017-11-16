import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import {
  canAccountLevelWriteResource
} from './../../../../../../../shared/utils/privileges/privileges';

import { ClubStatus } from '../../../club.status';
import { CPSession } from './../../../../../../../session/index';
import { CP_PRIVILEGES_MAP } from './../../../../../../../shared/constants';

interface IState {
  query: string;
  type: string;
}

const state: IState = {
  query: null,
  type: null
};

@Component({
  selector: 'cp-clubs-list-action-box',
  templateUrl: './clubs-list-action-box.component.html',
  styleUrls: ['./clubs-list-action-box.component.scss']
})
export class ClubsListActionBoxComponent implements OnInit {
  @Output() filter: EventEmitter<IState> = new EventEmitter();

  clubFilter;
  canCreate;
  state: IState = state;

  constructor(
    private session: CPSession
  ) { }

  onUpdateState(data, key: string): void {
    this.state = Object.assign({}, this.state, { [key]: data });
    this.filter.emit(this.state);
  }

  ngOnInit() {
    this.canCreate = canAccountLevelWriteResource(this.session.g, CP_PRIVILEGES_MAP.clubs);

    this.clubFilter = [
      {
        label: 'All Clubs',
        action: null
      },
      {
        label: 'Active',
        action: ClubStatus.active
      },
      {
        label: 'Inactive',
        action: ClubStatus.inactive
      },
      {
        label: 'Pending',
        action: ClubStatus.pending
      }
    ];
  }
}
