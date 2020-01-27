import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
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

  constructor() {}

  ngOnInit() {}
}
