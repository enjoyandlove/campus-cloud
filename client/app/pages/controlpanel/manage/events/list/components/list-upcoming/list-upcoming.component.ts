import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FORMAT } from '../../../../../../../shared/pipes';

@Component({
  selector: 'cp-list-upcoming',
  templateUrl: './list-upcoming.component.html',
  styleUrls: ['./list-upcoming.component.scss']
})
export class ListUpcomingComponent implements OnInit {
  @Output() deleteEvent: EventEmitter<any> = new EventEmitter();
  @Input() events: any;
  dateFormat = FORMAT.LONG;

  constructor() { }

  onDelete() {
    console.log('deleting');
  }

  ngOnInit() { }
}
