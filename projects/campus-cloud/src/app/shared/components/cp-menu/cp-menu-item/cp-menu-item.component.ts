import { Component } from '@angular/core';

@Component({
  selector: 'cp-menu-item',
  template: `
    <li>
      <ng-content></ng-content>
    </li>
  `,
  styleUrls: ['./cp-menu-item.component.scss']
})
export class CPMenuItemComponent {}
