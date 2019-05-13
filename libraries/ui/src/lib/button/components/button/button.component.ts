/* tslint:disable:component-selector */
import {
  Input,
  OnInit,
  ElementRef,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { Component } from '@angular/core';

const allowedAttributes = ['raised', 'stroked', 'transparent'];

@Component({
  selector: `button[uiButton], a[uiButton]`,
  template: `<ng-content></ng-content>`,
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent implements OnInit {
  @Input() color: 'primary' | 'secondary' | 'danger' | 'success';

  constructor(private el: ElementRef) {
    const _el: HTMLElement = this.el.nativeElement;

    for (const attr of allowedAttributes) {
      if (_el.hasAttribute(attr)) {
        _el.classList.add(attr);
      }
    }
  }

  ngOnInit() {
    const _el: HTMLElement = this.el.nativeElement;
    _el.classList.add('ready-ui-button', this.color);
  }
}
