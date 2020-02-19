import {
  OnInit,
  Input,
  Output,
  Component,
  forwardRef,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

let nextUniqueId = 0;

@Component({
  selector: 'ready-ui-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent implements OnInit, ControlValueAccessor {
  _value = false;
  _checked = false;
  _disabled = false;
  _id = `text-field-${nextUniqueId++}`;

  @Input()
  label: string;

  @Input()
  ariaLabelledBy: string;

  @Input()
  set id(id: string) {
    this._id = id;
  }

  @Input()
  set checked(checked: string | boolean) {
    this._checked = coerceBooleanProperty(checked);
  }

  @Output()
  changed: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}

  onChange = (val: boolean) => {};

  onTouched = () => {};

  writeValue(val: boolean) {
    this._value = val;
    this.onChange(val);
    this.changed.emit(val);
  }

  registerOnChange(fn: (val: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }
}
