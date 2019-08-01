import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

let nextUniqueId = 0;

@Component({
  selector: 'cp-checkbox',
  templateUrl: './cp-checkbox.component.html',
  styleUrls: ['./cp-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CPCheckboxComponent {
  @Input() label: string;
  @Input() labelRight = true;
  @Input() isChecked: boolean;
  @Input() isDisabled: boolean;

  @Output() toggle: EventEmitter<boolean> = new EventEmitter();

  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
  }

  protected _id: string;

  protected _uid = `cp-checkbox-${nextUniqueId++}`;

  constructor() {
    if (!this.isChecked) {
      this.isChecked = false;
    }
  }

  onChange(evt) {
    this.toggle.emit(evt.target.checked);
  }
}
