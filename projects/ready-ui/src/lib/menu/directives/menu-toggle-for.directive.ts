/* tslint:disable:directive-selector */
import { Directive, Input, HostListener } from '@angular/core';

import { MenuComponent } from './../components/menu/menu.component';
@Directive({
  selector: '[menuToggleFor]'
})
export class MenuToggleForDirective {
  @Input('menuToggleFor') menu: MenuComponent;

  constructor() {}

  @HostListener('click', ['$event'])
  onclick(event) {
    this.menu.show(event.target);
  }
}
