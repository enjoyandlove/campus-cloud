import {
  Input,
  OnInit,
  Directive,
  ElementRef,
  HostListener,
  ComponentFactoryResolver
} from '@angular/core';

import { CPHostDirective } from '../cp-host';
import { CPLightboxComponent } from '../../components';

@Directive({
  selector: '[cpLightbox]'
})
export class CPLightboxDirective implements OnInit {
  @Input() images: string[];
  @Input() cpLightbox: string;
  @Input() host: CPHostDirective;
  @Input() selectedImageIndex: number;

  constructor(
    public elementRef: ElementRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.elementRef.nativeElement.style.cursor = 'pointer';
    this.elementRef.nativeElement.style.transition = '0.5s';
  }

  @HostListener('click')
  openLightbox() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      CPLightboxComponent
    );
    const viewContainerRef = this.host.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    const component: CPLightboxComponent = componentRef.instance;

    component.images = this.images;
    component.lightboxId = this.cpLightbox;
    component.index = this.selectedImageIndex;
    component.lightboxClose.subscribe(() => componentRef.destroy());
  }

  @HostListener('mouseover')
  showFeedback() {
    this.elementRef.nativeElement.style.opacity = 0.5;
  }

  @HostListener('mouseleave')
  hideFeedback() {
    this.elementRef.nativeElement.style.opacity = 1;
  }

  ngOnInit() {}
}
