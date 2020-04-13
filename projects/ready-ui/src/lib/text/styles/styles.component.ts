/*tslint:disable:component-selector*/
import { Input, Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'ui-text-style, [ui-text-style]',
  templateUrl: './styles.component.html',
  styleUrls: ['./styles.component.scss']
})
export class StylesComponent implements OnInit {
  @Input()
  variant: 'bold' | 'semibold' | 'caption';

  @Input()
  color: 'muted' | 'success' | 'danger' | 'info';

  constructor() {}

  @HostBinding('class.color--muted')
  get isMuted() {
    return this.color === 'muted';
  }

  @HostBinding('class.color--success')
  get isSuccess() {
    return this.color === 'success';
  }

  @HostBinding('class.color--danger')
  get isDanger() {
    return this.color === 'danger';
  }

  @HostBinding('class.color--info')
  get isInfo() {
    return this.color === 'info';
  }

  @HostBinding('class.variant--bold')
  get isBold() {
    return this.variant === 'bold';
  }

  @HostBinding('class.variant--semibold')
  get isSemiBold() {
    return this.variant === 'semibold';
  }

  @HostBinding('class.variant--caption')
  get isCaption() {
    return this.variant === 'caption';
  }

  ngOnInit() {}
}
