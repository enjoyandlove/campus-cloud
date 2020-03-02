import {
  Input,
  OnInit,
  Output,
  Component,
  HostListener,
  EventEmitter,
  HostBinding
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'ready-ui-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {
  _disabled = false;
  _triggersSubMenu = false;

  @Output()
  itemClick: EventEmitter<MenuItemComponent> = new EventEmitter();

  @Input()
  set disabled(disabled: string | boolean) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  constructor() {}

  @HostListener('click', ['$event'])
  _checkDisabled(event: Event): void {
    if (this._disabled) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.itemClick.emit(this);
    }
  }

  @HostBinding('class.disabled')
  get isDisabled() {
    return this._disabled;
  }

  ngOnInit() {}
}
