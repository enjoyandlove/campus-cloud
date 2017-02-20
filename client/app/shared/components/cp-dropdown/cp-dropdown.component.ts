import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

interface IItems {
  'label': string;
  'action': string;
}

@Component({
  selector: 'cp-dropdown',
  templateUrl: './cp-dropdown.component.html',
  styleUrls: ['./cp-dropdown.component.scss']
})
export class CPDropdownComponent implements OnInit {
  @Input() items: IItems[];
  @Output() itemSelected: EventEmitter<any> = new EventEmitter();
  selected: any;
  dummyContent = [];

  constructor() { }

  ngOnInit() {
    console.log(this);
  }
}
