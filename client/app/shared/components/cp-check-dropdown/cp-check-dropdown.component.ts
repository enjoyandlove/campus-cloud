import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

interface IItem {
  label: string;
  action: number;
  decsritpion: string;
}

@Component({
  selector: 'cp-check-dropdown',
  templateUrl: './cp-check-dropdown.component.html',
  styleUrls: ['./cp-check-dropdown.component.scss']
})
export class CPCheckDropdownComponent implements OnInit {
  @Input() items: Array<IItem>;
  @Input() selectedItem: IItem;
  @Input() buttonClass: string;
  @Output() selected: EventEmitter<IItem> = new EventEmitter();

  constructor() { }

  onClick(item) {
    this.selectedItem = item;
    this.selected.emit(item);
  }

  ngOnInit() {
    this.selectedItem = this.selectedItem ? this.selectedItem : this.items[0];
  }
}
