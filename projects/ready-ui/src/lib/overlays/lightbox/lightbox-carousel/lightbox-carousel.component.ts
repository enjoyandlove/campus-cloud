import {
  Input,
  Output,
  Component,
  ViewChild,
  ElementRef,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import Swiper from 'swiper';

interface IItem {
  url: string;
  active: boolean;
}

@Component({
  selector: 'ready-ui-lightbox-carousel',
  templateUrl: './lightbox-carousel.component.html',
  styleUrls: ['./lightbox-carousel.component.scss']
})
export class LightboxCarouselComponent implements AfterViewInit {
  @ViewChild('carousel', { static: true }) private carousel: ElementRef;

  swiper: Swiper;

  @Input()
  images: string[];

  @Output()
  close: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngAfterViewInit() {
    this.swiper = new Swiper(this.carousel.nativeElement, {
      slidesPerView: 'auto',
      initialSlide: 0,
      centeredSlides: true,
      spaceBetween: 30,
      slideToClickedSlide: true,
      keyboard: {
        enabled: true
      }
    });
  }

  setActiveImage(slideToIndex: number) {
    this.swiper.slideTo(slideToIndex);
  }
}
