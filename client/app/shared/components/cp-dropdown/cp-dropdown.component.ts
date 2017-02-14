import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-dropdown',
  templateUrl: './cp-dropdown.component.html',
  styleUrls: ['./cp-dropdown.component.scss']
})
export class CPDropdownComponent implements OnInit {
  @Output() itemSelected: EventEmitter<any> = new EventEmitter();
  selected: any;
  dummyContent = [];

  constructor() { }

  ngOnInit() {
    this.dummyContent = [
      {
        id: 1,
        label: 'Events'
      },
      {
        id: 2,
        label: 'Services'
      },
      {
        id: 3,
        label: 'Deals'
      },
      {
        id: 4,
        label: 'Announcements'
      },
      {
        id: 5,
        label: 'Social'
      }
    ];
  }
}
