import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export const BUTTON_ALIGN = {
  LEFT: 'left',
  RIGHT: 'right'
};

export interface IButtonDropdown {
  button: {
    'label': string;
    'url': string;
  };
  children: [
    {
      'label': string;
      'event': string;
    }
  ];
}

@Component({
  selector: 'cp-button-dropdown',
  templateUrl: './cp-button-dropdown.component.html',
  styleUrls: ['./cp-button-dropdown.component.scss']
})
export class CPButtonDropdownComponent implements OnInit {
  @Input() data: IButtonDropdown;
  @Input() align: string;
  @Output() selected: EventEmitter<{'label': string, 'event': string}> = new EventEmitter();
  constructor() { }

  onClick(item) {
    console.log(item);
    this.selected.emit(item);
  }

  ngOnInit() { }
}
