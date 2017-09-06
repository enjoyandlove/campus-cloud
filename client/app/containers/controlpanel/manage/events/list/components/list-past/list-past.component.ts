import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FORMAT } from '../../../../../../../shared/pipes';
import { CPSession } from './../../../../../../../session/index';
import { CP_PRIVILEGES_MAP } from './../../../../../../../shared/utils/privileges';

interface ISort {
  sort_field: string;
  sort_direction: string;
}

const sort = {
  sort_field: 'title', // title, start, end
  sort_direction: 'asc' // asc, desc
};

@Component({
  selector: 'cp-list-past',
  templateUrl: './list-past.component.html',
  styleUrls: ['./list-past.component.scss']
})
export class ListPastComponent implements OnInit {
  @Input() state: any;
  @Input() events: any;
  @Output() deleteEvent: EventEmitter<any> = new EventEmitter();
  @Output() sortList: EventEmitter<ISort> = new EventEmitter();

  sort: ISort = sort;

  canWriteSchoolWide;
  dateFormat = FORMAT.LONG;

  constructor(
    private session: CPSession
  ) { }

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

  ngOnInit() {
    this.canWriteSchoolWide = this.session.canSchoolWriteResource(CP_PRIVILEGES_MAP.events);
  }
}
