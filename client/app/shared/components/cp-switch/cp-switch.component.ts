import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'cp-switch',
  templateUrl: './cp-switch.component.html',
  styleUrls: ['./cp-switch.component.scss']
})
export class CPSwitchComponent implements OnInit {
  @Input() checked: boolean;
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();
  isChecked = false;

  constructor() { }

  onChange(evt) {
    this.isChecked = !this.isChecked;
    this.toggle.emit(evt.target.checked);
  }

  ngOnInit() {
    this.isChecked = this.checked;
  }
}
