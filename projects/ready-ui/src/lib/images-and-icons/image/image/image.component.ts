/* tslint:disable:component-selector */
import { Input, OnInit, Component, ElementRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'img[ready-ui-image]',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent implements OnInit {
  @Input()
  dataSrc: string;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if ('IntersectionObserver' in window) {
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
    }
  }
}
