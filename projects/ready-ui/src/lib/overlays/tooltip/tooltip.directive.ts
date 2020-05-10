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
import { filter, tap, takeUntil, debounceTime, delay, repeat } from 'rxjs/operators';
import { OnInit, NgZone } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { fromEvent, Observable } from 'rxjs';
import { merge, Subject } from 'rxjs';

import { TOOLTIP_DATA } from './tokens';
import { TooltipComponent } from './tooltip.component';

@Directive({
  exportAs: 'tooltip',
  selector: '[ui-tooltip]'
})
export class TooltipDirective implements OnInit, OnDestroy {
  _title = '';
  _offset = 5;
  _delay = 400;
  _show = false;
  _tooltip: OverlayRef;
  destroy$ = new Subject();
  _template: TemplateRef<any>;
  _templateCompRef: ComponentRef<TooltipComponent>;
  _placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

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

  constructor(
    private el: ElementRef,
    private overlay: Overlay,
    private injector: Injector,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    if (this._title !== '' || typeof this._template !== 'undefined') {
      this.ngZone.runOutsideAngular(() => this.attachListeners());
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  open() {
    this.ngZone.run(() => {
      this._tooltip = this.overlay.create(this.getConfig());
      const portal = new ComponentPortal<TooltipComponent>(
        TooltipComponent,
        null,
        this.createInjector()
      );
      this._templateCompRef = this._tooltip.attach<TooltipComponent>(portal);
      this._show = true;
    });
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
    const panelClass = ['ui-tooltip', this.tooltipClass].filter((c) => c).join(' ');
    return {
      panelClass,
      disposeOnNavigation: true,
      scrollStrategy: this.overlay.scrollStrategies.close(),
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

    const blur$ = fromEvent(el, 'blur');
    const focus$ = fromEvent(el, 'focus');
    const mouseleave$ = fromEvent(el, 'mouseleave');
    const mouseenter$ = fromEvent(el, 'mouseenter');
    const delayedEntrance$ = mouseenter$.pipe(
      delay(this._delay),
      takeUntil(mouseleave$),
      repeat()
    );
    const mousemove$ = fromEvent(document, 'mousemove');

    const hoverOutSideTriggerAndTooltip$ = mousemove$.pipe(
      filter(() => this._show),
      debounceTime(this._delay),
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

    const escape$ = fromEvent(document, 'keyup').pipe(
      filter((e: KeyboardEvent) => e.code === 'Escape')
    );

    const openEvents$ = merge(delayedEntrance$, focus$).pipe(
      filter(() => !this._show),
      tap(() => this.open())
    );

    const closeEvents$ = merge(blur$, escape$, hoverOutSideTriggerAndTooltip$).pipe(
      filter(() => this._show),
      tap(() => this.close())
    );

    openEvents$.pipe(takeUntil(this.destroy$)).subscribe();
    closeEvents$.pipe(takeUntil(this.destroy$)).subscribe();
  }
}
