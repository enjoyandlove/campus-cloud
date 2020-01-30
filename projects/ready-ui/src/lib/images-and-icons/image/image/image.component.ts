/* tslint:disable:component-selector */
import {
  Input,
  OnInit,
  NgZone,
  Component,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'img[ready-ui-image]',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent implements OnInit {
  @Input()
  dataSrc: string;

  constructor(private el: ElementRef, private ngZone: NgZone) {}

  ngOnInit() {
    if ('IntersectionObserver' in window) {
      this.ngZone.runOutsideAngular(() => {
        const lazyImageObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const lazyImage: any = entry.target;
              lazyImage.src = this.dataSrc;
              lazyImageObserver.unobserve(lazyImage);
            }
          });
        });

        lazyImageObserver.observe(this.el.nativeElement);
      });
    }
  }
}
