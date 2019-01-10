import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[cpTarget]'
})
export class CPTargetDirective {
  @Input()
  set cpTarget(value: string | number) {
    const el = this.elementRef.nativeElement as HTMLElement;

    el.setAttribute('data-target', String(value ? value : 'cp-target'));
  }

  constructor(public elementRef: ElementRef) {}
}
