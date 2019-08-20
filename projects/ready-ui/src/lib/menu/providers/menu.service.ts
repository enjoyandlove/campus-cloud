import { Injectable } from '@angular/core';

import { MenuComponent } from './../components/menu/menu.component';
@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private dropdown: MenuComponent;

  public register(dropdown: MenuComponent) {
    this.dropdown = dropdown;
  }

  public getDropdown(): MenuComponent {
    return this.dropdown;
  }
}
