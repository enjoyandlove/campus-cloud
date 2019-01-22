import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[cpTarget]'
})
export class CPTargetDirective {
  static attribute = 'data-target';

  @Input()
  set cpTarget(value: string | number) {
    const el = this.elementRef.nativeElement as HTMLElement;

    el.setAttribute(CPTargetDirective.attribute, String(value ? value : 'cp-target'));
  }

  constructor(public elementRef: ElementRef) {}
}
