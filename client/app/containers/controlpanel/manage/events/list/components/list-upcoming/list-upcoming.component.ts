import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FORMAT } from '../../../../../../../shared/pipes';

interface ISort {
  sort_field: string;
  sort_direction: string;
}

const sort = {
  sort_field: 'title', // title, start, end
  sort_direction: 'asc' // asc, desc
};

@Component({
  selector: 'cp-list-upcoming',
  templateUrl: './list-upcoming.component.html',
  styleUrls: ['./list-upcoming.component.scss']
})
export class ListUpcomingComponent implements OnInit {
  @Input() state: any;
  @Input() events: any;
  @Output() deleteEvent: EventEmitter<any> = new EventEmitter();
  @Output() sortList: EventEmitter<ISort> = new EventEmitter();

  sort: ISort = sort;
  dateFormat = FORMAT.SHORT;

  constructor() { }

  onDelete(event) {
    this.deleteEvent.emit(event);
  }

  doSort(sort_field) {
    let sort_direction = this.state.sort_direction === 'asc' ? 'desc' : 'asc';

    this.sort = Object.assign(
      {},
      this.sort,
      { sort_field, sort_direction: sort_direction }
    );

    this.sortList.emit(this.sort);
  }

  ngOnInit() { }
}
