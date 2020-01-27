/*tslint:disable:directive-selector */
import {
  Input,
  Injector,
  Directive,
  OnDestroy,
  ElementRef,
  TemplateRef,
  ComponentRef
} from '@angular/core';
import { OverlayRef, OverlayConfig, ConnectedPosition } from '@angular/cdk/overlay';
import { coerceNumberProperty, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { filter, tap, takeUntil } from 'rxjs/operators';
import { InjectionToken } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { fromEvent, Observable } from 'rxjs';
import { OnInit } from '@angular/core';
import { merge, Subject } from 'rxjs';

import { TOOLTIP_DATA } from './tokens';
import { TooltipComponent } from './tooltip.component';

@Directive({
  selector: '[ui-tooltip]'
})
export class TooltipDirective implements OnInit, OnDestroy {
  _title = '';
  _offset = 5;
  _delay = 400;
  _show = false;
  _tooltip: OverlayRef;
  _template: TemplateRef<any>;
  _templateCompRef: ComponentRef<TooltipComponent>;
  _placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  blur$: Observable<Event>;
  hover$: Observable<Event>;
  focus$: Observable<Event>;
  escape$: Observable<Event>;
  mousemove$: Observable<Event>;
  hoverOutSideTriggerAndTooltip$: Observable<Event>;

  openEvents$: Observable<Event>;
  closeEvents$: Observable<Event>;

  destroy$ = new Subject();

  @Input()
  tooltipClass = '';

  @Input()
  set delay(delay: string | number) {
    this._delay = coerceNumberProperty(delay);
  }

  @Input()
  set show(show: string | boolean) {
    this._show = coerceBooleanProperty(show);
  }

  @Input()
  set title(title: string) {
    this._title = title;
  }

  @Input()
  set offset(offset: string | number) {
    this._offset = coerceNumberProperty(offset);
  }

  @Input()
  set template(template: TemplateRef<any>) {
    this._template = template;
  }

  @Input()
  set placement(placement: 'top' | 'bottom' | 'left' | 'right') {
    this._placement = placement;
  }

  constructor(private el: ElementRef, private overlay: Overlay, private injector: Injector) {}

  ngOnInit() {
    this.attachListeners();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  open() {
    this._tooltip = this.overlay.create(this.getConfig());
    const portal = new ComponentPortal<TooltipComponent>(
      TooltipComponent,
      null,
      this.createInjector()
    );
    this._templateCompRef = this._tooltip.attach<TooltipComponent>(portal);
    this._show = true;
  }

  close() {
    this._show = false;
    this._templateCompRef = null;
    this._tooltip.dispose();
    this._tooltip = null;
  }

  private getOffset() {
    const offset = this._offset;
    const offsetYPlacements = ['bottom', 'top'];
    const offsetY = offsetYPlacements.includes(this._placement)
      ? this._placement === 'bottom'
        ? offset
        : Number(`-${offset}`)
      : 0;

    const offsetXPlacements = ['left', 'right'];
    const offsetX = offsetXPlacements.includes(this._placement)
      ? this._placement === 'right'
        ? offset
        : Number(`-${offset}`)
      : 0;

    return {
      x: offsetX,
      y: offsetY
    };
  }

  private getConfig(): OverlayConfig {
    const { x, y } = this.getOffset();
    const panelClass = ['ui-tooltip', this.tooltipClass].filter((c) => c);
    return {
      panelClass,
      disposeOnNavigation: true,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.el)
        .withPositions(this.getPosition())
        .withDefaultOffsetX(x)
        .withDefaultOffsetY(y)
    };
  }

  private getPosition(): ConnectedPosition[] {
    const position: ConnectedPosition[] = [];

    switch (this._placement) {
      case 'bottom':
        position.push(
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top'
          },
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'center'
          }
        );
        break;
      case 'top':
        position.push({
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom'
        });
        break;
      case 'left':
        position.push({
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'center'
        });
        break;
      case 'right':
        position.push({
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center'
        });
        break;
    }

    return position;
  }

  private createInjector(): PortalInjector {
    const injectorTokens = new WeakMap();
    injectorTokens.set(TOOLTIP_DATA, {
      title: this._title,
      template: this._template,
      placement: this._placement
    });
    return new PortalInjector(this.injector, injectorTokens);
  }

  private attachListeners() {
    const el: HTMLElement = this.el.nativeElement;

    this.blur$ = fromEvent(el, 'blur');
    this.focus$ = fromEvent(el, 'focus');
    this.hover$ = fromEvent(el, 'mouseenter');
    this.mousemove$ = fromEvent(document, 'mousemove');

    this.hoverOutSideTriggerAndTooltip$ = this.mousemove$.pipe(
      filter(() => this._show),
      filter((e: MouseEvent) => {
        // const { x, y } = this.getOffset();

        const tooltipEl: HTMLElement = this._templateCompRef.instance.el.nativeElement;
        const triggerBoundingRect = el.getBoundingClientRect();
        const tooltipBoundingRect = tooltipEl.getBoundingClientRect();

        const isMouseOutsideTooltipBody =
          e.x < tooltipBoundingRect.left ||
          e.x > tooltipBoundingRect.left + tooltipBoundingRect.width ||
          (e.y < tooltipBoundingRect.top ||
            e.y > tooltipBoundingRect.top + tooltipBoundingRect.height);

        const isMouseOutsideTooltipTrigger =
          e.x < triggerBoundingRect.left ||
          e.x > triggerBoundingRect.left + triggerBoundingRect.width ||
          (e.y < triggerBoundingRect.top ||
            e.y > triggerBoundingRect.top + triggerBoundingRect.height);

        return isMouseOutsideTooltipBody && isMouseOutsideTooltipTrigger;
      })
    );

    this.escape$ = fromEvent(document, 'keyup').pipe(
      filter((e: KeyboardEvent) => e.code === 'Escape')
    );

    this.openEvents$ = merge(this.hover$, this.focus$).pipe(
      filter(() => !this._show),
      tap(() => this.open())
    );

    this.closeEvents$ = merge(this.blur$, this.escape$, this.hoverOutSideTriggerAndTooltip$).pipe(
      filter(() => this._show),
      tap(() => this.close())
    );

    this.openEvents$.pipe(takeUntil(this.destroy$)).subscribe();
    this.closeEvents$.pipe(takeUntil(this.destroy$)).subscribe();
  }
}
