import {
  Input,
  OnInit,
  Component,
  QueryList,
  forwardRef,
  ContentChildren,
  AfterContentInit
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { merge, Subject } from 'rxjs';

import { OptionComponent } from './../option/option.component';
let nextUniqueId = 0;

@Component({
  selector: 'ready-ui-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements OnInit, AfterContentInit, ControlValueAccessor {
  @ContentChildren(OptionComponent, { descendants: true }) private options: QueryList<
    OptionComponent
  >;
  _multiple = false;
  _disabled = false;
  value: string | number;
  _id = `ready-ui-select-${nextUniqueId++}`;

  @Input()
  set id(id: string) {
    this._id = id;
  }

  @Input()
  label: string;

  @Input()
  ariaLabelledBy: string;

  @Input()
  set multiple(multiple: string | boolean) {
    this._multiple = coerceBooleanProperty(multiple);
  }

  get triggerLabel() {
    if (!this.options) {
      return;
    }
    const selected = this.options.find((o: OptionComponent) => Boolean(o.selected));
    return selected ? selected.label : this.options.first.label;
  }

  constructor() {}

  ngOnInit() {}

  ngAfterContentInit() {
    if (this.value || this.value === '') {
      this.setSelected(this.value);
    }

    const changes$ = merge(...this.options.map((o: OptionComponent) => o.change$));
    changes$.subscribe(this.setSelected.bind(this));
  }

  setSelected(value: string | number) {
    this.options.forEach((o: OptionComponent) => (o.selected = o.value === value));
    const selectedOption = this.options.find((o: OptionComponent) => Boolean(o.selected));

    this.writeValue(selectedOption ? selectedOption.value : null);
  }

  onChange = (val: string | number) => {};

  onTouched = () => {};

  writeValue(val: string | number) {
    this.value = val;
    this.onChange(val);
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }
}
