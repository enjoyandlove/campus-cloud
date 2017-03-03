import { Component, OnInit, Input } from '@angular/core';

import { STAR_SIZE } from '../../../../../../../shared/components/cp-stars';

@Component({
  selector: 'cp-attendance-past',
  templateUrl: './past.component.html',
  styleUrls: ['./past.component.scss']
})
export class AttendancePastComponent implements OnInit {
  @Input() event: any;
  listStarSize = STAR_SIZE.DEFAULT;
  detailStarSize = STAR_SIZE.LARGE;

  constructor() { }

  ngOnInit() { }
}
