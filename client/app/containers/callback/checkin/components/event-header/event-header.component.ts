import { Component, Input, OnInit } from '@angular/core';

import { FORMAT } from '../../../../../shared/pipes/date';

@Component({
  selector: 'cp-event-header',
  templateUrl: './event-header.component.html',
  styleUrls: ['./event-header.component.scss']
})
export class CheckinEventHeaderComponent implements OnInit {
  @Input() event: any;

  dateFormat = FORMAT.DATETIME;

  constructor() {}

  ngOnInit() {}
}
