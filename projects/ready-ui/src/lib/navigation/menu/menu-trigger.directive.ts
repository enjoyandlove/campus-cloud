/*tslint:disable:directive-selector */
import {
  Self,
  Optional,
  OnDestroy,
  ElementRef,
  HostListener,
  ViewContainerRef
} from '@angular/core';
import { Overlay, OverlayConfig, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Directive, Input } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { merge, of, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { MenuComponent } from './menu/menu.component';
import { MenuItemComponent } from './menu-item/menu-item.component';

@Directive({
  selector: '[ready-ui-menu-trigger]'
})
export class MenuTriggerDirective implements OnDestroy {
  _menuOpen = false;
  _menu: MenuComponent;
  overlayRef: OverlayRef;
  _closingActionsSubscription = Subscription.EMPTY;

  @Input('triggerFor')
  get menu() {
    return this._menu;
  }
  set menu(menu: MenuComponent) {
    if (menu === this._menu) {
      return;
    }

    this._menu = menu;

    if (menu) {
      menu.closed.subscribe((reason) => {
        this.destroyMenu();
        if (this.parentMenu && reason !== 'PARENT') {
          this.parentMenu.closed.emit();
        }
      });
    }
  }

  constructor(
    private el: ElementRef,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    @Optional() private parentMenu: MenuComponent,
    @Optional() @Self() private menuItemInstance: MenuItemComponent
  ) {
    if (this.menuItemInstance) {
      this.menuItemInstance._triggersSubMenu = this.triggersSubmenu();
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.triggersSubmenu()) {
      event.stopPropagation();
      this.open();
    } else {
      this.toggleMenu();
    }
  }

  toggleMenu() {
    this._menuOpen ? this.closeMenu() : this.open();
  }

  ngOnDestroy() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }

    this._closingActionsSubscription.unsubscribe();
  }

  destroyMenu() {
    if (!this.overlayRef || !this._menuOpen) {
      return;
    }

    this._closingActionsSubscription.unsubscribe();

    this.toggleOpenState(false);

    this.overlayRef.detach();
  }

  triggersSubmenu(): boolean {
    return !!(this.menuItemInstance && this.parentMenu);
  }

  toggleOpenState(open: boolean) {
    this._menuOpen = open;
  }

  private open() {
    if (this._menuOpen) {
      return;
    }

    const overlayRef = this.createOverlay();
    const portal = new TemplatePortal(this.menu.template, this.viewContainerRef);

    this.menu.parentMenu = this.triggersSubmenu() ? this.parentMenu : undefined;

    this.toggleOpenState(true);

    this.overlayRef = overlayRef;
    this.overlayRef.attach(portal);

    this._closingActionsSubscription = this.menuClosingActions().subscribe(() => this.closeMenu());
  }

  private createOverlay(): OverlayRef {
    if (!this.overlayRef) {
      const config = this.getConfig();
      this.overlayRef = this.overlay.create(config);
    }
    return this.overlayRef;
  }

  private menuClosingActions() {
    const detachments = this.overlayRef.detachments();
    const parentClose = this.parentMenu ? this.parentMenu.closed : of();
    const backdropClick = this.overlayRef.backdropClick();
    const parentMenuItemClicks = this.parentMenu
      ? this.parentMenu.childrenClick$.pipe(
          filter(() => this._menuOpen),
          filter((m) => m !== this.menu)
        )
      : of();

    return merge(detachments, backdropClick, parentClose, parentMenuItemClicks);
  }

  private closeMenu() {
    this.menu.closed.emit('PARENT');
  }

  private getConfig(): OverlayConfig {
    return {
      backdropClass: 'ready-ui-menu',
      positionStrategy: this.getPosition(),
      hasBackdrop: this.triggersSubmenu() ? false : true,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    };
  }

  private getPosition(): PositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo(this.el)
      .withPositions([
        {
          originX: this.triggersSubmenu() ? 'end' : 'start',
          overlayX: 'start',
          originY: this.triggersSubmenu() ? 'top' : 'bottom',
          overlayY: 'top'
        }
      ])
      .withDefaultOffsetY(this.triggersSubmenu() ? 0 : 5)
      .withDefaultOffsetX(this.triggersSubmenu() ? 5 : 0);
  }
}
