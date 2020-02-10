import {
  Overlay,
  OverlayRef,
  OverlayConfig,
  PositionStrategy,
  ConnectedPosition
} from '@angular/cdk/overlay';
import {
  Input,
  Directive,
  ElementRef,
  TemplateRef,
  HostListener,
  ViewContainerRef
} from '@angular/core';
import { coerceNumberProperty, coerceBooleanProperty } from '@angular/cdk/coercion';
import { TemplatePortal } from '@angular/cdk/portal';

@Directive({
  exportAs: 'popover',
  selector: '[readyUiPopoverTrigger]'
})
export class PopoverTriggerDirective {
  _inheritWidth = false;
  yAxisOffset = 0;
  xAxisOffset = 0;

  @Input()
  uiPopoverTpl: TemplateRef<any>;

  @Input()
  set inheritWidth(inheritWidth: false) {
    this._inheritWidth = coerceBooleanProperty(inheritWidth);
  }

  @Input()
  set uiPopoverYOffset(uiPopoverYOffset: string | number) {
    this.yAxisOffset = coerceNumberProperty(uiPopoverYOffset);
  }

  @Input()
  set uiPopoverXOffset(uiPopoverXOffset: string | number) {
    this.xAxisOffset = coerceNumberProperty(uiPopoverXOffset);
  }

  @Input()
  position: 'left' | 'right' = 'left';

  isOpen = false;
  overlayRef: OverlayRef;

  constructor(
    private el: ElementRef,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {}

  @HostListener('click')
  handleClick() {
    this.overlayRef ? this.close() : this.open();
  }

  open() {
    if (this.isOpen) {
      return;
    }

    if (!this.uiPopoverTpl) {
      return;
    }

    this.overlayRef = this.overlay.create(this.getConfig());
    const portal: TemplatePortal = new TemplatePortal(this.uiPopoverTpl, this.viewContainerRef, {
      popover: this
    });
    this.overlayRef.attach(portal);

    this.overlayRef.backdropClick().subscribe(() => this.close());
  }

  close() {
    if (!this.overlayRef) {
      return;
    }
    this.overlayRef.dispose();
    this.overlayRef = null;
  }

  private getConfig(): OverlayConfig {
    const { offsetWidth } = this.el.nativeElement;

    return {
      hasBackdrop: true,
      maxHeight: '500px',
      disposeOnNavigation: true,
      backdropClass: 'ui-popover',
      positionStrategy: this.getPositionStrategy(),
      width: this._inheritWidth ? `${offsetWidth}px` : undefined,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    };
  }

  private getPositionStrategy(): PositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo(this.el)
      .withPositions(this.getPosition())
      .withDefaultOffsetY(this.yAxisOffset)
      .withDefaultOffsetX(this.xAxisOffset)
      .withPush(false);
  }

  private getPosition(): ConnectedPosition[] {
    return [
      {
        originX: this.position === 'left' ? 'start' : 'end',
        originY: 'bottom',
        overlayX: this.position === 'left' ? 'start' : 'end',
        overlayY: 'top'
      }
    ];
  }
}
