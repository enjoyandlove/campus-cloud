import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cp-sorting-header',
  templateUrl: './cp-sorting-header.component.html',
  styleUrls: ['./cp-sorting-header.component.scss']
})
export class CPSortingHeaderComponent implements OnInit {
  @Input() label: string;
  @Input() sortField: string;
  @Input() sortLabel: string;
  @Input() sortDirection: string;

  constructor() {}

  ngOnInit() {
    console.log(this.label);
  }
}
