import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'ready-ui-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss']
})
export class ModalHeaderComponent implements OnInit {
  @Output()
  close: EventEmitter<void> = new EventEmitter();

  _closable = true;

  @Input()
  set closable(closable: string | boolean) {
    this._closable = coerceBooleanProperty(closable);
  }

  constructor() {}

  ngOnInit(): void {}
}
