import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-tab',
  templateUrl: './cp-tab.component.html',
  styleUrls: ['./cp-tab.component.scss']
})
export class CPTabComponent {
  @Input() id: string;
  @Input() title: string;
  @Input() active = false;

  @Output() destroy: EventEmitter<null> = new EventEmitter();

  constructor() {}
}
