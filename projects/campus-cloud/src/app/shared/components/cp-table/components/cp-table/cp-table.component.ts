import { Component, OnInit, Input } from '@angular/core';

import { CPTableRow, CPTableColumn } from '../../interfaces';

@Component({
  selector: 'cp-table',
  templateUrl: './cp-table.component.html',
  styleUrls: ['./cp-table.component.scss']
})
export class CPTableComponent implements OnInit {
  @Input()
  columns: CPTableColumn[];

  @Input()
  rows: CPTableRow[];

  constructor() {}

  ngOnInit() {}
}
