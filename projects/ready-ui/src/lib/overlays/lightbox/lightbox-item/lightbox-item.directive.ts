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
  selector: 'img[ready-ui-lighbox-item]'
})
export class LightboxItemDirective implements OnInit {
  get src() {
    return this.el.nativeElement.src;
  }

  @Output()
  click$: EventEmitter<string> = new EventEmitter();

  constructor(private el: ElementRef) {}

  @HostListener('click')
  onClick() {
    this.click$.emit(this.src);
  }

  ngOnInit() {
    this.el.nativeElement.style.cursor = 'pointer';
  }
}
