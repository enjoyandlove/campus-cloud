import {
  Input,
  Output,
  Component,
  forwardRef,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextUniqueId = 0;

@Component({
  selector: 'ready-ui-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true
    }
  ]
})
export class ToggleComponent {
  protected _uid = `ready-ui-toggle-${nextUniqueId++}`;
  protected _id: string;

  @Input()
  isChecked: boolean;

  @Input()
  ariaLabelledBy: string;

  @Output()
  toggle: EventEmitter<boolean> = new EventEmitter();

  onChanged: any = () => {};
  onTouched: any = () => {};

  @Input()
  get id(): string {
    return this._uid;
  }

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
