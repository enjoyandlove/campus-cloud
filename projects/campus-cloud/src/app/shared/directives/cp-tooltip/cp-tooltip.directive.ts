import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { fromEvent, merge, Subject } from 'rxjs';
import { TooltipOption } from 'bootstrap';
import { omit } from 'lodash';

// https://getbootstrap.com/docs/4.1/components/tooltips/#options
const defaultOptions: TooltipOption = {
  placement: 'bottom',
  sanitize: false,
  trigger: 'manual',
  sanitizeFn: (content) => content
};

@Directive({
  selector: '[cpTooltip]'
})
export class CPToolTipDirective implements OnInit, OnDestroy {
  @Input() cpTooltip: TooltipOption;
  // tslint:disable-next-line:no-input-rename
  @Input('attr.title') title: string;

  currentTooltip: HTMLElement;

  mouseMoves$ = fromEvent(document, 'mousemove').pipe(
    filter(() => this.currentTooltip !== undefined),
    filter((e: any) => {
      let isMouseOutsideTooltipBody = true;
      let isMouseOutsideTooltipTrigger = false;
      const { clientY, clientX } = e;
      {
        const { left, width, top, height } = this.currentTooltip.getBoundingClientRect();
        isMouseOutsideTooltipBody =
          clientX < left || clientX > left + width || (clientY < top || clientY > top + height);
      }

      {
        const { left, width, top, height } = this.el.nativeElement.getBoundingClientRect();
        isMouseOutsideTooltipTrigger =
          clientX < left || clientX > left + width || (clientY < top || clientY > top + height);
      }

      return isMouseOutsideTooltipBody && isMouseOutsideTooltipTrigger;
    })
  );

  destroy = new Subject();
  blur$ = fromEvent(this.el.nativeElement, 'blur');
  focus$ = fromEvent(this.el.nativeElement, 'focus');
  elementHover$ = fromEvent(this.el.nativeElement, 'mouseenter');
  escape$ = fromEvent(document, 'keyup').pipe(filter((event: any) => event.key === 'Escape'));

  openTriggers$ = merge(this.focus$, this.elementHover$);
  closeTriggers$ = merge(this.escape$, this.mouseMoves$, this.blur$);

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.openTriggers$.pipe(takeUntil(this.destroy)).subscribe(() => this.open());
    this.closeTriggers$.pipe(takeUntil(this.destroy)).subscribe(() => this.hide());
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  private open() {
    $(this.el.nativeElement)
      .tooltip({
        ...defaultOptions,
        ...omit(this.cpTooltip, ['trigger']),
        title: this.title
      })
      .tooltip('show')
      .on('shown.bs.tooltip', (e) => {
        const tooltipId = e.target.getAttribute('aria-describedby');
        this.currentTooltip = document.getElementById(tooltipId);
      });
  }

  private hide() {
    $(this.el.nativeElement)
      .tooltip('hide')
      .on('hidden.bs.tooltip', () => (this.currentTooltip = undefined));
  }
}
