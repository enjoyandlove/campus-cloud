import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cp-table-close',
  templateUrl: './cp-table-close.component.html',
  styleUrls: ['./cp-table-close.component.scss']
})
export class CPTableCloseComponent implements OnInit {
  @Output()
  handleClick: EventEmitter<Event> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
