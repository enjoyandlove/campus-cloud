import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FORMAT } from '../../../../../../../shared/pipes';

interface IState {
  sort_field: string;
  sort_direction: string;
}

const state = {
  sort_field: 'title', // title, start, end
  sort_direction: 'asc' // asc, desc
};


@Component({
  selector: 'cp-list-upcoming',
  templateUrl: './list-upcoming.component.html',
  styleUrls: ['./list-upcoming.component.scss']
})
export class ListUpcomingComponent implements OnInit {
  @Output() deleteEvent: EventEmitter<any> = new EventEmitter();
  @Output() sortList: EventEmitter<IState> = new EventEmitter();
  @Input() events: any;

  state: IState = state;
  dateFormat = FORMAT.LONG;

  constructor() { }

  onDelete(event) {
    this.deleteEvent.emit(event);
  }

  doSort(sort_field) {
    let sort_direction = this.state.sort_direction === 'asc' ? 'desc' : 'asc';

    this.state = Object.assign(
      {},
      this.state,
      { sort_field, sort_direction: sort_direction }
    );

    this.sortList.emit(this.state);

  }

  ngOnInit() {
    console.log('initi');
  }
}
