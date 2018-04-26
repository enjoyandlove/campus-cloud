import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'cp-dropdown-multiselect',
  templateUrl: './cp-dropdown-multiselect.component.html',
  styleUrls: ['./cp-dropdown-multiselect.component.scss']
})
export class CPDropdownMultiSelectComponent implements OnInit, OnChanges {
  @Input() items: Array<{ action: number; label: string; selected: boolean }> = [];

  @Output() selection: EventEmitter<Array<number>> = new EventEmitter();

  state = {
    open: false,
    label: null
  };

  constructor(public el: ElementRef) {}

  ngOnChanges() {
    if (!this.items.filter((item) => item.selected).length) {
      this.state = { ...this.state, label: null };

      this.items.map((opt) => (opt.selected = false));
    }
  }

  buildLabel(selected) {
    return selected.map((item) => item.label).join(', ');
  }

  updateLabel(selected) {
    this.state = { ...this.state, label: selected.map((item) => item.label).join(', ') };
  }

  onToggle(event: Event, option) {
    if (event) {
      // prevent BS dropdown from closing
      event.stopPropagation();
    }

    option.selected = !option.selected;

    const selected = this.items.filter((opt) => opt.selected);

    this.updateLabel(selected);

    this.selection.emit(selected.map((item) => item.action));
  }

  ngOnInit(): void {
    const selected = this.items.filter((item) => item.selected);

    if (selected.length) {
      this.updateLabel(selected);
    }
  }
}
