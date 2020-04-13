import {
  Input,
  Output,
  Component,
  ViewChild,
  ElementRef,
  HostListener,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'ready-ui-lightbox-carousel',
  templateUrl: './lightbox-carousel.component.html',
  styleUrls: ['./lightbox-carousel.component.scss']
})
export class LightboxCarouselComponent implements AfterViewInit {
  @ViewChild('wrapper', { static: true }) private wrapper: ElementRef;
  @ViewChild('carousel', { static: true }) private carousel: ElementRef;

  swiper: Swiper;

  @Input()
  images: string[];

  @Output()
  close: EventEmitter<null> = new EventEmitter();

  constructor() {}

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const insideWrapper = (event.target as HTMLElement).contains(this.wrapper.nativeElement);
    if (insideWrapper) {
      this.close.emit();
    }
  }

  ngAfterViewInit() {
    this.swiper = new Swiper(this.carousel.nativeElement, {
      slidesPerView: 'auto',
      speed: 50,
      initialSlide: 0,
      centeredSlides: true,
      spaceBetween: 30,
      slideToClickedSlide: true,
      keyboard: {
        enabled: true
      },
      fadeEffect: {
        crossFade: true
      }
    });
  }

  setActiveImage(slideToIndex: number) {
    this.swiper.slideTo(slideToIndex);
  }
}
