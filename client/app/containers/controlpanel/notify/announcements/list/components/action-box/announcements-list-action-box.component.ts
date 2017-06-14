import { Component, OnInit, Output, EventEmitter } from '@angular/core';

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
  state: IState = state;

  constructor() { }

  onSearch(query) {
    this.state = Object.assign({}, this.state, { query });
    this.filter.emit(this.state);
  }

  onSelectedType(type) {
    this.state = Object.assign({}, this.state, { type: type.action });
    this.filter.emit(this.state);
  }

  ngOnInit() {
    this.types = [
      {
        'label': 'All',
        'action': null
      },
      {
        'label': 'Regular',
        'action': 1
      },
      {
        'label': 'Urgent',
        'action': 2
      },
      {
        'label': 'Emergency',
        'action': 3
      }
    ];
  }
}
