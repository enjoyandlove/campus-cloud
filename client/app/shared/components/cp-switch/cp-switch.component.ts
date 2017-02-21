import {
  Input,
  OnInit,
  Output,
  Component,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'cp-switch',
  templateUrl: './cp-switch.component.html',
  styleUrls: ['./cp-switch.component.scss']
})
export class CPSwitchComponent implements OnInit {
  @Input() checked: boolean;
  @Input() id: string;
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
