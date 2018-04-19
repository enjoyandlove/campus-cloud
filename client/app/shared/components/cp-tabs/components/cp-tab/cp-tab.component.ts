import { Component, Input } from '@angular/core';

@Component({
  selector: 'cp-tab',
  templateUrl: './cp-tab.component.html',
  styleUrls: ['./cp-tab.component.scss']
})
export class CPTabComponent {
  @Input() title: string;
  @Input() active = false;

  constructor() {}
}
