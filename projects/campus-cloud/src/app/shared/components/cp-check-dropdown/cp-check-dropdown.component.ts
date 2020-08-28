import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Observable, of as observableOf } from 'rxjs';

interface IItem {
  label: string;
  action: number;
  decsritpion: string;
  disabled?: boolean;
  displayCheckIcon?: boolean;
}

@Component({
  selector: 'cp-check-dropdown',
  templateUrl: './cp-check-dropdown.component.html',
  styleUrls: ['./cp-check-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CPCheckDropdownComponent),
      multi: true
    }
  ]
})
export class CPCheckDropdownComponent implements OnInit, ControlValueAccessor {
  @Input() items: Array<IItem>;
  @Input() reset: Observable<boolean>;
  @Input() selectedItem: IItem;
  @Input() buttonClass: string;
  @Input() dropdownListClass: string;
  @Output() selected: EventEmitter<IItem> = new EventEmitter();

  constructor() {}

  onClick(item: IItem) {
    if (item.disabled) {
      return;
    }

    this.selectedItem = item;
    this.selected.emit(item);
    this._onChanged(item.action);
  }

  writeValue(obj: any): void {}

  _onChanged(a) {}

  _onTouched() {}

  registerOnChange(fn: any): void {
    this._onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
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
