import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';

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
  @Input() reset: Observable<boolean>;
  @Input() selectedItem: IItem;
  @Input() buttonClass: string;
  @Output() selected: EventEmitter<IItem> = new EventEmitter();

  constructor() {}

  onClick(item) {
    this.selectedItem = item;
    this.selected.emit(item);
  }

  resetMenu() {
    this.selectedItem = this.items[0];
  }

  ngOnInit() {
    this.selectedItem = this.selectedItem ? this.selectedItem : this.items[0];

    if (!this.reset) {
      this.reset = observableOf(false);
    }

    this.reset.subscribe((reset) => {
      if (reset) {
        this.resetMenu();
      }
    });
  }
}
