/* tslint:disable:directive-selector */
import { Input, Output, OnDestroy, ElementRef, EventEmitter, AfterViewInit } from '@angular/core';
import { Directive } from '@angular/core';
import { NgZone } from '@angular/core';

@Directive({
  selector: '[ready-ui-interceptor]'
})
export class InterceptorDirective implements AfterViewInit, OnDestroy {
  @Input()
  threshold: number[] = [0, 1];

  @Output()
  visible: EventEmitter<boolean> = new EventEmitter();

  observer: IntersectionObserver;

  constructor(private el: ElementRef, private ngZone: NgZone) {}

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  ngAfterViewInit() {
    if ('IntersectionObserver' in window) {
      this.ngZone.runOutsideAngular(() => {
        this.observer = new IntersectionObserver(this.checkForIntersection.bind(this), {
          threshold: this.threshold
        });

        this.observer.observe(this.el.nativeElement);
      });
    }
  }

  checkForIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (this.isIntersecting(entry)) {
        this.visible.emit();
        this.observer.unobserve(this.el.nativeElement);
        this.observer.disconnect();
      }
    });
  }

  isIntersecting(entry: IntersectionObserverEntry) {
    return (<any>entry).isIntersecting && entry.target === this.el.nativeElement;
  }
}
