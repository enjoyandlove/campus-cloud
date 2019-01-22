import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CPDropdownComponent implements OnInit {
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

  onClick(item) {
    if (item.heading) {
      return;
    }

    this.selectedItem = item;
    this.selected.emit(item);
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
