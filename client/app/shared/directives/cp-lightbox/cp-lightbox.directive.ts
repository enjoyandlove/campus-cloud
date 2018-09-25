import {
  Input,
  OnInit,
  Directive,
  HostListener,
  ViewContainerRef,
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
    public viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

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

  ngOnInit() {}
}
