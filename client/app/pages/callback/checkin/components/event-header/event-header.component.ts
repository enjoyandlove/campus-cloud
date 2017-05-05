import { Component, OnInit, Input } from '@angular/core';

import { FORMAT } from '../../../../../shared/pipes/date.pipe';

@Component({
  selector: 'cp-event-header',
  templateUrl: './event-header.component.html',
  styleUrls: ['./event-header.component.scss']
})
export class CheckinEventHeaderComponent implements OnInit {
  @Input() event: any;

  dateFormat = FORMAT.DATETIME;

  constructor() { }

  ngOnInit() { }
}
