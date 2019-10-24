import { Component, OnInit, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'cp-table',
  templateUrl: './cp-table.component.html',
  styleUrls: ['./cp-table.component.scss']
})
export class CPTableComponent implements OnInit {
  @Input()
  columns: {
    label: string;
    onClick?: () => {};
    sortable?: boolean;
    sorting?: boolean;
    sortingDirection?: 'asc' | 'desc';
  }[];

  @Input()
  rows: {
    label?: string;
    template?: TemplateRef<any>;
    context?: any;
  }[];

  constructor() {}

  ngOnInit() {}
}
