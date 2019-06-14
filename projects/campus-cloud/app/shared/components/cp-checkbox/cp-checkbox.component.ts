import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

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

  constructor() {
    if (!this.isChecked) {
      this.isChecked = false;
    }
  }

  onChange(evt) {
    this.toggle.emit(evt.target.checked);
  }
}
