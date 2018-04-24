import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  HostListener,
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

  @HostListener('window:click', ['$event'])
  onClick(event) {
    if (event.target.contains(this.el.nativeElement)) {
      this.state = { ...this.state, open: false };
    }
  }

  toggleDropdown() {
    this.state = { ...this.state, open: !this.state.open };
  }

  ngOnChanges() {
    if (!this.items.filter((item) => item.selected).length) {
      this.state = { ...this.state, label: null };

      this.items.map((opt) => (opt.selected = false));

      // this.selection.emit([]);
    }
  }

  onToggle(option) {
    option.selected = !option.selected;

    const selected = this.items.filter((opt) => opt.selected);

    this.state = { ...this.state, label: selected.map((item) => item.label).join(', ') };

    this.selection.emit(selected.map((item) => item.action));
  }

  ngOnInit(): void {}
}
