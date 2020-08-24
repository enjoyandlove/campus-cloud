import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, of as observableOf } from 'rxjs';
import {
  Input,
  OnInit,
  Output,
  Component,
  forwardRef,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

export interface IItem {
  label: string;
  action: string | number;

  heading?: boolean;
}

export function getItem(object: any, label: string, action: string): IItem {
  return { label: object[label], action: object[action] };
}

@Component({
  selector: 'cp-dropdown',
  templateUrl: './cp-dropdown.component.html',
  styleUrls: ['./cp-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CPDropdownComponent), multi: true }
  ]
})
export class CPDropdownComponent implements OnInit, ControlValueAccessor {
  @Input() items: IItem[];
  @Input() disabled = false;
  @Input() selectedItem: any;
  @Input() isRequiredError: boolean;
  @Input() reset: Observable<boolean>;

  @Output() selected: EventEmitter<{ label: string; event: string }> = new EventEmitter();

  query = null;
  searchFixed = true;
  isSearching = false;
  MIN_RESULTS_FOR_SEARCH = 15;

  constructor() {}

  static defaultPlaceHolder(label = '---'): IItem {
    return {
      action: null,
      label
    };
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

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onClick(item) {
    if (item.heading) {
      return;
    }

    this.selectedItem = item;
    this.selected.emit(item);
    // stores.service returns IStore[] which differs from IItem
    this._onChanged(item.action ? item.action : item.value);
    this.query = null;
  }

  onSearch(query) {
    this.query = query;
  }

  resetDropdown() {
    this.selectedItem = this.items[0];
    this.selected.emit(this.selectedItem);
  }

  ngOnInit() {
    if (!this.reset) {
      this.reset = observableOf(false);
    }

    this.reset.subscribe((reset) => {
      if (reset) {
        this.resetDropdown();
      }
    });
  }
}
