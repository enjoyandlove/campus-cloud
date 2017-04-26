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
  @Input() selectedItem: any;
  @Input() isRequiredError: boolean;
  @Output() selected: EventEmitter<{'label': string, 'event': string}> = new EventEmitter();

  constructor() { }

  onClick(item) {
    this.selected.emit(item);
  }

  ngOnInit() {
    // console.log(this.items);
  }
}
