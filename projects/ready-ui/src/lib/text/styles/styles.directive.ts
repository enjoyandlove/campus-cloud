/*tslint:disable:directive-selector*/
import { Directive, Input, OnInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { css } from 'emotion';

@Directive({
  selector: '[ui-text-style]'
})
export class StylesDirective implements OnInit {
  @Input()
  variant: 'bold' | 'caption';

  @Input()
  color: 'muted' | 'success' | 'danger' | 'info';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.applyStyles();
  }

  getColorStyles() {
    return css`
      ${this.color === 'muted' &&
        css`
          color: #757575;
        `}
      ${this.color === 'danger' &&
        css`
          color: #ff6059;
        `}
      ${this.color === 'success' &&
        css`
          color: #28ca42;
        `}
      ${this.color === 'info' &&
        css`
          color: #3498db;
        `}
    `;
  }

  getVariantStyles() {
    return css`
      ${this.variant === 'bold' &&
        css`
          font-weight: 600;
        `}
      ${this.variant === 'caption' &&
        css`
          font-size: 0.8em;
        `}
    `;
  }

  applyStyles() {
    const el: HTMLElement = this.el.nativeElement;
    el.classList.add(this.getColorStyles(), this.getVariantStyles());
  }
}
