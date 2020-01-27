import { Input, Component, OnInit, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'ready-ui-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent implements OnInit {
  _centered = true;

  @Input()
  color = '#2c94e9';

  @Input()
  size: 'regular' | 'small' = 'regular';

  @Input()
  set centered(centered: string | boolean) {
    this._centered = coerceBooleanProperty(centered);
  }

  constructor() {}

  @HostBinding('class.centered')
  get isCentered() {
    return this._centered;
  }

  ngOnInit() {}

  get classes() {
    return {
      [`spinner--${this.size}`]: true
    };
  }
}
