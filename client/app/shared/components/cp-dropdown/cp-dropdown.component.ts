import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';

interface IItems {
  label: string;
  action: string;
  heading?: boolean;
}

@Component({
  selector: 'cp-dropdown',
  templateUrl: './cp-dropdown.component.html',
  styleUrls: ['./cp-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CPDropdownComponent implements OnInit {
  @Input() items: IItems[];
  @Input() disabled = false;
  @Input() selectedItem: any;
  @Input() isRequiredError: boolean;
  @Input() reset: Observable<boolean>;
  @Output() selected: EventEmitter<{ label: string; event: string }> = new EventEmitter();

  query = null;
  searchFixed = true;
  isSearching = false;
  MIN_RESULTS_FOR_SEARCH = 40;

  constructor() {}

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
