import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';
import { TooltipOption } from 'bootstrap';

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
    if (typeof this.cpTooltip === 'boolean' && !this.cpTooltip) {
      return;
    }

    $(this.el.nativeElement).tooltip({
      ...defaultOptions,
      ...this.cpTooltip
    });
  }
}
