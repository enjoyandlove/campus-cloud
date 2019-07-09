import {
  Input,
  Output,
  Component,
  forwardRef,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'cp-switch',
  templateUrl: './cp-switch.component.html',
  styleUrls: ['./cp-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CPSwitchComponent), multi: true }
  ]
})
export class CPSwitchComponent implements ControlValueAccessor {
  @Input() id: string;
  @Input() isChecked: boolean;
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();

  onChanged: any = () => {};
  onTouched: any = () => {};

  constructor() {}

  onChange() {
    this.onTouched();
    this.isChecked = !this.isChecked;
    this.onChanged(this.isChecked);
    this.toggle.emit(this.isChecked);
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
