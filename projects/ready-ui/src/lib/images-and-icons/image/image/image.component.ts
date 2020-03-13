/* tslint:disable:component-selector */
import {
  Input,
  OnInit,
  NgZone,
  Component,
  OnDestroy,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'img[ready-ui-image]',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent implements OnInit, OnDestroy {
  @Input()
  dataSrc: string;

  observer: IntersectionObserver;

  constructor(private el: ElementRef, private ngZone: NgZone) {}

  ngOnInit() {
    if ('IntersectionObserver' in window) {
      this.ngZone.runOutsideAngular(() => {
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const lazyImage: any = entry.target;
              lazyImage.src = this.dataSrc;
              this.observer.unobserve(lazyImage);
            }
          });
        });
        this.observer.observe(this.el.nativeElement);
      });
    }
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}
