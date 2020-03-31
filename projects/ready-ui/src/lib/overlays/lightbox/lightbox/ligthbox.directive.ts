/* tslint:disable:directive-selector */
import {
  Input,
  Directive,
  OnDestroy,
  QueryList,
  ContentChildren,
  AfterContentInit
} from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayConfig } from '@angular/cdk/overlay';
import { takeUntil, filter } from 'rxjs/operators';
import { merge, Subject, fromEvent } from 'rxjs';
import { Overlay } from '@angular/cdk/overlay';

import { LightboxItemDirective } from './../lightbox-item/lightbox-item.directive';
import { LightboxCarouselComponent } from './../lightbox-carousel/lightbox-carousel.component';

@Directive({
  exportAs: 'lightbox',
  selector: '[ready-ui-lightbox]'
})
export class LigthboxDirective implements AfterContentInit, OnDestroy {
  timeOut: number;
  destroy$: Subject<void> = new Subject();

  private _panelClass = 'ready-ui-lightbox';

  @ContentChildren(LightboxItemDirective, { descendants: true }) private images: QueryList<
    LightboxItemDirective
  >;

  @Input()
  set panelClass(panelClass: string) {
    this.panelClass += ` ${panelClass}`;
  }
  constructor(private overlay: Overlay) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    clearTimeout(this.timeOut);
  }

  ngAfterContentInit() {
    const open$ = merge(...this.images.map((i) => i.click$)).pipe(takeUntil(this.destroy$));
    open$.subscribe((imageUrl: string) => this.open(imageUrl));
  }

  open(activeImgUrl: string) {
    const overlayRef = this.overlay.create(this.getConfig());
    const portal = new ComponentPortal<LightboxCarouselComponent>(LightboxCarouselComponent);
    const carousel = overlayRef.attach(portal);

    const images = this.images.map((i) => i.src);
    const clickedImageIndex = images.findIndex((imageUrl: string) => imageUrl === activeImgUrl);
    carousel.instance.images = this.images.map((i) => i.src);

    this.timeOut = setTimeout(() => {
      carousel.instance.setActiveImage(clickedImageIndex);
    });

    const backdropClick$ = overlayRef.backdropClick();
    const carouselCloseClick$ = carousel.instance.close;
    const escapeKey$ = fromEvent(document, 'keyup').pipe(
      filter(({ code }: KeyboardEvent) => code === 'Escape')
    );
    const closeActions$ = merge(backdropClick$, carouselCloseClick$, escapeKey$);
    closeActions$.pipe(takeUntil(this.destroy$)).subscribe(() => overlayRef.dispose());
  }

  getConfig(): OverlayConfig {
    return {
      maxWidth: '100vw',
      hasBackdrop: true,
      disposeOnNavigation: true,
      panelClass: this._panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay
        .position()
        .global()
        .centerVertically()
        .centerHorizontally()
    };
  }
}
