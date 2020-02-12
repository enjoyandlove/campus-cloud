import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

let nextAvailableId = 0;

@Component({
  selector: 'ready-ui-settings-toggle',
  templateUrl: './settings-toggle.component.html',
  styleUrls: ['./settings-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsToggleComponent implements OnInit {
  _checked = false;
  id = `ready-ui-settings-toggle-${nextAvailableId++}`;

  @Input()
  label: string;

  @Input()
  set isChecked(isChecked: string | boolean) {
    this._checked = coerceBooleanProperty(isChecked);
  }

  @Output()
  toggle: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onToggle(checked: boolean) {
    this._checked = checked;
    this.toggle.emit(this._checked);
  }
}
