import { Component, Input, OnInit, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'ready-ui-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent implements OnInit {
  _round = false;

  @Input()
  src: string;

  @Input()
  alt: string;

  @Input()
  size: 'regular' | 'small' | 'big' = 'regular';

  @Input()
  set round(round: string | boolean) {
    this._round = coerceBooleanProperty(round);
  }

  @HostBinding('class.size-regular')
  get isRegular() {
    return this.size === 'regular';
  }

  @HostBinding('class.size-small')
  get isSmall() {
    return this.size === 'small';
  }

  @HostBinding('class.size-big')
  get isBig() {
    return this.size === 'big';
  }

  constructor() {}

  ngOnInit() {}

  get classes() {
    return {
      round: this._round
    };
  }
}
