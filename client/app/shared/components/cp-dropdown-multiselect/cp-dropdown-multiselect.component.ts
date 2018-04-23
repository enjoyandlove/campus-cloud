import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'cp-dropdown-multiselect',
  templateUrl: './cp-dropdown-multiselect.component.html',
  styleUrls: ['./cp-dropdown-multiselect.component.scss']
})
export class CPDropdownMultiSelectComponent implements OnInit {
  @Input() items: Array<any> = [];

  @Input() placeholder;

  @Output() selection: EventEmitter<Array<any>> = new EventEmitter();

  state = {
    open: false,
    label: null
  };

  constructor(public el: ElementRef) {}

  toggleDropdown() {
    this.state = { ...this.state, open: !this.state.open };
  }

  onToggle(option) {
    option.selected = !option.selected;

    const selected = this.items.filter((opt) => opt.selected);

    this.state = { ...this.state, label: selected.map((item) => item.label).join(', ') };

    this.selection.emit(selected);
  }

  ngOnInit(): void {}
}
