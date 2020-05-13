import {
  ComponentType,
  PortalInjector,
  ComponentPortal,
  TemplatePortal
} from '@angular/cdk/portal';
import { Injectable, TemplateRef, Injector, InjectionToken } from '@angular/core';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';

import { ModalComponent } from './modal/modal.component';

export const READY_MODAL_DATA = new InjectionToken<any>('READY_MODAL_DATA');

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  ref: OverlayRef;

  constructor(private _overlay: Overlay, private _injector: Injector) {}

  open(componentOrTemplateRef: ComponentType<any> | TemplateRef<any>, data = {}) {
    const overlayRef = this._createOverlay();
    const dialogContainer = this._attachDialogContainer(overlayRef);
    const dialogRef = this._attachDialogContent(
      componentOrTemplateRef,
      dialogContainer,
      overlayRef,
      data
    );
    return dialogRef;
  }

  private _attachDialogContent<T, R>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    dialogContainer: ModalComponent,
    overlayRef: OverlayRef,
    data
  ) {
    // When the dialog backdrop is clicked, we want to close it.
    overlayRef.backdropClick().subscribe(() => {
      overlayRef.dispose();
    });

    if (componentOrTemplateRef instanceof TemplateRef) {
      dialogContainer.attachTemplatePortal(
        new TemplatePortal<T>(componentOrTemplateRef, null, <any>{ $implicit: data })
      );
    } else {
      const injector = this._createInjector<T>(data);
      dialogContainer.attachComponentPortal<T>(
        new ComponentPortal(componentOrTemplateRef, null, injector)
      );
    }

    return overlayRef;
  }

  private _createInjector<T>(data = {}): PortalInjector {
    const injectionTokens = new WeakMap<any, any>([[READY_MODAL_DATA, data]]);
    return new PortalInjector(this._injector, injectionTokens);
  }

  private _createOverlay(): OverlayRef {
    const overlayConfig = this._getOverlayConfig();
    return this._overlay.create(overlayConfig);
  }

  private _attachDialogContainer(overlay: OverlayRef): ModalComponent {
    overlay.backdropClick().subscribe(() => overlay.dispose());

    const injector = this._createInjector();

    const containerPortal = new ComponentPortal(ModalComponent, null, injector, null);

    const containerRef = overlay.attach<ModalComponent>(containerPortal);

    return containerRef.instance;
  }

  private _getOverlayConfig(): OverlayConfig {
    return {
      minWidth: '30em',
      hasBackdrop: true,
      disposeOnNavigation: true,
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically()
    };
  }
}
