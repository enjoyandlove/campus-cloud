import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ready-ui-option-group',
  templateUrl: './option-group.component.html',
  styleUrls: ['./option-group.component.scss']
})
export class OptionGroupComponent implements OnInit {
  _disabled: boolean;

  @Input()
  label: string;

  @Input()
  set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  constructor() {}

  ngOnInit() {}
}
