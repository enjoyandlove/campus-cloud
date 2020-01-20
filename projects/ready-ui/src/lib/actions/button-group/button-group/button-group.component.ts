import {
  Component,
  QueryList,
  HostBinding,
  ContentChildren,
  ViewEncapsulation,
  AfterContentInit,
  ChangeDetectionStrategy
} from '@angular/core';

import { ButtonComponent } from './../../button/button/button.component';

@Component({
  selector: 'ready-ui-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonGroupComponent implements AfterContentInit {
  @ContentChildren(ButtonComponent) private items: QueryList<ButtonComponent>;
  constructor() {}

  @HostBinding('class.ready-ui-button-group')
  ngAfterContentInit() {
    this.items.forEach((button: ButtonComponent) => {
      const buttonNativeEl: HTMLElement = button.el.nativeElement;
      buttonNativeEl.classList.add('button-group-item');
    });
  }
}
