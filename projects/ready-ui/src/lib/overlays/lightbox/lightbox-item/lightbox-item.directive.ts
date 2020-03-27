/* tslint:disable:directive-selector */
import {
  Input,
  OnInit,
  Output,
  Directive,
  ElementRef,
  HostListener,
  EventEmitter
} from '@angular/core';

@Directive({
  selector: '[ready-ui-lighbox-item]'
})
export class LightboxItemDirective implements OnInit {
  @Input()
  src: string;

  @Output()
  click$: EventEmitter<string> = new EventEmitter();

  constructor(private el: ElementRef) {}

  @HostListener('click')
  onClick() {
    this.click$.emit(this.src);
  }

  ngOnInit() {
    if (this.el.nativeElement instanceof HTMLImageElement) {
      this.el.nativeElement.src = this.src;
    }
  }
}
