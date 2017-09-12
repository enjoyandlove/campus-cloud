import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { CPSession } from '../../../../../../../session';
import { CP_PRIVILEGES_MAP } from '../../../../../../../shared/constants';

interface IState {
  query: string;
  type: number;
}

const state: IState = {
  query: null,
  type: null
};

@Component({
  selector: 'cp-announcements-list-action-box',
  templateUrl: './announcements-list-action-box.component.html',
  styleUrls: ['./announcements-list-action-box.component.scss']
})
export class AnnouncementsListActionBoxComponent implements OnInit {
  @Output() filter: EventEmitter<IState> = new EventEmitter();
  @Output() launchModal: EventEmitter<null> = new EventEmitter();

  types;
  canCompose;
  state: IState = state;

  constructor(
    private session: CPSession
  ) { }

  onSearch(query) {
    this.state = Object.assign({}, this.state, { query });
    this.filter.emit(this.state);
  }

  onSelectedType(type) {
    this.state = Object.assign({}, this.state, { type: type.action });
    this.filter.emit(this.state);
  }

  ngOnInit() {
    let schoolPrivilege = this.session.user.school_level_privileges[this.session.school.id];

    this.canCompose = schoolPrivilege[CP_PRIVILEGES_MAP.campus_announcements].w;

    this.types = [
      {
        'label': 'All',
        'action': null
      },
      {
        'label': 'Regular',
        'action': 2
      },
      {
        'label': 'Urgent',
        'action': 1
      },
      {
        'label': 'Emergency',
        'action': 0
      }
    ];
  }
}
