import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FORMAT } from '../../../../../../../shared/pipes';


@Component({
  selector: 'cp-list-past',
  templateUrl: './list-past.component.html',
  styleUrls: ['./list-past.component.scss']
})
export class ListPastComponent implements OnInit {
  @Input() events: any;
  @Output() deleteEvent: EventEmitter<any> = new EventEmitter();

  dateFormat = FORMAT.LONG;

  constructor() { }

  onDelete() {
    console.log('deleting');
  }

  ngOnInit() {
    console.log(this.events);
  }
}
