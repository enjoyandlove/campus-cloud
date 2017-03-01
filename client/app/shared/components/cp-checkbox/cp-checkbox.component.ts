import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'cp-checkbox',
  templateUrl: './cp-checkbox.component.html',
  styleUrls: ['./cp-checkbox.component.scss']
})
export class CPCheckboxComponent implements OnInit {
  @Input() isChecked: boolean;
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();

  constructor() {
    if (!this.isChecked ) {
      this.isChecked = false;
    }
  }

  ngOnInit() {
    // console.log('init check');
  }

  onChange(evt) {
    this.toggle.emit(evt.target.checked);
  }
}
