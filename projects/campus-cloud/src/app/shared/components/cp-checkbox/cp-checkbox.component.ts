import {
  Input,
  Output,
  Component,
  forwardRef,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import { NG_VALUE_ACCESSOR } from '@angular/forms';

let nextUniqueId = 0;

@Component({
  selector: 'cp-checkbox',
  templateUrl: './cp-checkbox.component.html',
  styleUrls: ['./cp-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CPCheckboxComponent), multi: true }
  ]
})
export class CPCheckboxComponent {
  protected _id: string;
  protected _uid = `cp-checkbox-${nextUniqueId++}`;

  @Input() label: string;
  @Input() hasError: boolean;
  @Input() labelRight = true;
  @Input() isChecked: boolean;
  @Input() isDisabled: boolean;

  @Output() toggle: EventEmitter<boolean> = new EventEmitter();

  onChanged: any = () => {};
  onTouched: any = () => {};

  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
  }

  constructor() {
    if (!this.isChecked) {
      this.isChecked = false;
    }
  }

  onChange(evt) {
    this.onTouched();
    this.onChanged(evt.target.checked);
    this.toggle.emit(evt.target.checked);
  }

  writeValue(val) {
    this.isChecked = val;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  registerOnChange(fn) {
    this.onChanged = fn;
  }
}
