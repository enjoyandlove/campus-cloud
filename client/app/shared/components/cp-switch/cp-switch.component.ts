import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'cp-switch',
  templateUrl: './cp-switch.component.html',
  styleUrls: ['./cp-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CPSwitchComponent implements OnInit {
  @Input() id: string;
  @Input() isChecked: boolean;
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  onChange() {
    this.isChecked = !this.isChecked;
    this.toggle.emit(this.isChecked);
  }

  ngOnInit() {
    // console.log(this);
  }
}
