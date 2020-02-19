import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, OnInit, Input } from '@angular/core';

let nextAvailableId = 0;

@Component({
  selector: 'ready-ui-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {
  uid = `ui-tab-${nextAvailableId++}`;
  _visible = false;
  _disabled = false;

  @Input()
  label: string;

  @Input()
  set disabled(disabled: string | number) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  @Input()
  set visible(visible: string | boolean) {
    this._visible = coerceBooleanProperty(visible);
  }

  get visible() {
    return this._visible;
  }

  get id() {
    return this.uid;
  }

  constructor() {}

  ngOnInit() {}
}
