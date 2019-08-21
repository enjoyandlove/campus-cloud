import { Input, Component, OnInit } from '@angular/core';

import { MenuComponent } from './../menu/menu.component';
import { MenuService } from './../../providers/menu.service';
@Component({
  selector: 'ready-ui-menu-item, [ready-ui-menu-item]',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  host: {
    '(click)': 'handleClick($event)'
  }
})
export class MenuItemComponent implements OnInit {
  private _disabled = false;
  private parent: MenuComponent;

  @Input()
  set disabled(disabled: string) {
    this._disabled = !disabled;
  }
  constructor(private service: MenuService) {
    this.parent = this.service.getDropdown();
  }

  handleClick(event) {
    if (this._disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.parent.hide();
  }

  ngOnInit() {}
}
