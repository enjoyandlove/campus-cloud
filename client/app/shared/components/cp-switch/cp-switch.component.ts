import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-switch',
  templateUrl: './cp-switch.component.html',
  styleUrls: ['./cp-switch.component.scss']
})
export class CPSwitchComponent implements OnInit {
  @Output() change: EventEmitter<boolean> = new EventEmitter();
  constructor() { }

  onChange(evt) {
    this.change.emit(evt.target.checked);
  }

  ngOnInit() { }
}
