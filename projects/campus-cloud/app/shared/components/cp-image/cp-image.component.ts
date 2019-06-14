import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';

import { environment } from '@campus-cloud/environments/environment';

const allowedAttributes = ['cp-image', 'rounded', 'small', 'fitCover'];

@Component({
  selector: 'img[cp-image]',
  templateUrl: './cp-image.component.html',
  styleUrls: ['./cp-image.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CPImageComponent implements OnInit {
  constructor(private elementRef: ElementRef) {
    const el = this.getHostElement();
    const defaultImage = `${environment.root}assets/default/user.png`;

    el.src = el.src === '' ? defaultImage : el.src;

    for (const attr of allowedAttributes) {
      if (this.hasHostAttributes(attr)) {
        el.classList.add(attr);
      }
    }
  }

  getHostElement(): HTMLImageElement {
    return this.elementRef.nativeElement;
  }

  hasHostAttributes(...attributes: string[]) {
    return attributes.some((attribute) => this.getHostElement().hasAttribute(attribute));
  }

  ngOnInit(): void {}
}
