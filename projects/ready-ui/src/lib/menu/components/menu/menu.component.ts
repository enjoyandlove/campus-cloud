import { OverlayConfig, OverlayRef, Overlay } from '@angular/cdk/overlay';
import { Component, HostListener, ViewChild } from '@angular/core';
import { TemplatePortalDirective } from '@angular/cdk/portal';
import { ViewEncapsulation } from '@angular/core';

import { MenuService } from './../../providers/menu.service';

@Component({
  selector: 'ready-ui-menu',
  exportAs: 'readyMenu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [MenuService],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent {
  @ViewChild(TemplatePortalDirective, { static: false })
  public contentTemplate: TemplatePortalDirective;

  public showing = false;
  private reference: HTMLElement;
  protected overlayRef: OverlayRef;

  constructor(protected overlay: Overlay, private service: MenuService) {
    this.service.register(this);
  }

  public show(reference: HTMLElement) {
    this.reference = reference;
    this.overlayRef = this.overlay.create(this.getOverlayConfig());
    this.overlayRef.attach(this.contentTemplate);
    this.syncWidth();
    this.overlayRef.backdropClick().subscribe(() => this.hide());
    this.showing = true;
  }

  public hide() {
    this.overlayRef.detach();
    this.showing = false;
  }

  @HostListener('window:resize')
  public onWinResize() {
    this.syncWidth();
  }

  protected getOverlayConfig(): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.reference)
      .withPush(false)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom'
        }
      ])
      .withDefaultOffsetY(10);

    const scrollStrategy = this.overlay.scrollStrategies.reposition();

    return new OverlayConfig({
      hasBackdrop: true,
      scrollStrategy: scrollStrategy,
      positionStrategy: positionStrategy,
      backdropClass: 'cdk-overlay-transparent-backdrop'
    });
  }

  private syncWidth() {
    if (!this.overlayRef) {
      return;
    }

    const { width } = this.reference.getBoundingClientRect();
    this.overlayRef.updateSize({ width });
  }
}
