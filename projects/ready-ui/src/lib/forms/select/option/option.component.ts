import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'ready-ui-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  host: { tabindex: '-1' }
})
export class OptionComponent implements OnInit {
  _selected = false;
  _disabled = false;
  _change = new Subject();
  change$ = this._change.asObservable();

  @Input()
  value: string | number;

  @Input()
  label: string | number;

  @Input()
  set disabled(disabled: string | boolean) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  @Input()
  set selected(selected: string | boolean) {
    this._selected = coerceBooleanProperty(selected);
  }

  get selected() {
    return this._selected;
  }

  get optionClassess() {
    return {
      'option--disabled': this._disabled,
      'option--selected': this._selected
    };
  }

  constructor() {}

  ngOnInit() {}

  clickHandler() {
    if (!this._disabled) {
      this._change.next(this.value);
    }
  }
}
