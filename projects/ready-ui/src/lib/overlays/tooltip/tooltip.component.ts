import {
  OnInit,
  Inject,
  Component,
  ElementRef,
  HostBinding,
  ChangeDetectionStrategy
} from '@angular/core';

import { TOOLTIP_DATA } from './tooltip.directive';

@Component({
  selector: 'ready-ui-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent implements OnInit {
  constructor(@Inject(TOOLTIP_DATA) public data, public el: ElementRef) {}

  @HostBinding('class.ready-ui-tooltip')
  @HostBinding('class.position--top')
  get isTop() {
    return this.data['placement'] === 'top';
  }

  @HostBinding('class.position--bottom')
  get isBottom() {
    return this.data['placement'] === 'bottom';
  }

  @HostBinding('class.position--left')
  get isLeft() {
    return this.data['placement'] === 'left';
  }

  @HostBinding('class.position--right')
  get isRight() {
    return this.data['placement'] === 'right';
  }

  ngOnInit() {}
}
