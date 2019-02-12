import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';
import { TooltipOption } from 'bootstrap';

import { isBoolean } from '@shared/utils/coercion';

// https://getbootstrap.com/docs/4.1/components/tooltips/#options
const defaultOptions: TooltipOption = {
  placement: 'bottom'
};

@Directive({
  selector: '[cpTooltip]'
})
export class CPToolTipDirective implements AfterViewInit {
  @Input() cpTooltip: TooltipOption;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    if (isBoolean(this.cpTooltip) && !this.cpTooltip) {
      return;
    }

    $(this.el.nativeElement).tooltip({
      ...defaultOptions,
      ...this.cpTooltip
    });
  }
}
