import { Directive, ElementRef, OnInit, Input } from '@angular/core';

import settings from '../../../config/settings';

@Directive({
  selector: '[cpImageRatio]'
})
export class CPImageRatioDirective implements OnInit {
  @Input() ratio = settings.imageRatio;

  constructor(public el: ElementRef) {}

  aspectRatio() {
    const imgEl = <HTMLImageElement>this.el.nativeElement;
    imgEl.style.display = 'none';
    const imgElParentWidth = imgEl.parentElement.clientWidth;

    imgEl.onload = () => {
      imgEl.height = imgElParentWidth / this.ratio;
      imgEl.style.width = '100%';
      imgEl.style.display = 'block';
      imgEl.style['object-fit'] = 'cover';
    };
  }

  ngOnInit() {
    this.aspectRatio();
  }
}
