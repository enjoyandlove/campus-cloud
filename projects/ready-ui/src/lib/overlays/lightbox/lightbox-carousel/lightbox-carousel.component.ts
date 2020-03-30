import {
  Input,
  Output,
  OnInit,
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  EventEmitter
} from '@angular/core';

interface IItem {
  url: string;
  active: boolean;
}

@Component({
  selector: 'ready-ui-lightbox-carousel',
  templateUrl: './lightbox-carousel.component.html',
  styleUrls: ['./lightbox-carousel.component.scss']
})
export class LightboxCarouselComponent implements OnInit, AfterViewInit {
  @ViewChild('carousel', { static: true }) private carousel: ElementRef;

  items: IItem[];
  imageDimensions: { [key: number]: number };

  @Input()
  set images(images: string[]) {
    this.items = images.map((url, index) => ({ url, active: index === 0 }));

    this.moveCarousel();
  }

  @Output()
  close: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  imageClickHandler(item: IItem) {
    this.setActiveImageByImgSrc(item.url);
    this.moveCarousel();
  }

  setActiveImageByImgSrc(imageUrl: string) {
    this.items.forEach((i) => (i.active = imageUrl === i.url));
  }

  moveCarousel() {
    const carouselEl: HTMLElement = this.carousel.nativeElement;
    const getActiveImageIndex = this.items.findIndex((i) => i.active);
    const width = this.getTotalImagesWidth(getActiveImageIndex);
    carouselEl.style.transform = `translateX(calc(-${width}px)`;
  }

  getTotalImagesWidth(index: number) {
    /**
     * sum of the images width we have viewed
     */
    return index === 0
      ? 0
      : Object.values(this.imageDimensions)
          .filter((_, idx) => idx < index)
          .reduce((a, b) => a + b);
  }

  getAtiveImage() {
    return this.items.find((i) => i.active);
  }

  ngAfterViewInit() {
    /**
     * Runs once, and returns an object with the element's
     * index as the key and the element's width as the value
     */
    const imageElements = Array.from(this.carousel.nativeElement.children);

    this.imageDimensions = imageElements.reduce(
      (result: { [key: number]: number }, { clientWidth }: HTMLElement, index: number) => {
        result[index] = clientWidth;
        return result;
      },
      {}
    ) as { [key: number]: number };
  }
}
