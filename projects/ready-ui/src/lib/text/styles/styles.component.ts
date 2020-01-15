/*tslint:disable:component-selector*/
import { Input, Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: '[ui-text-style]',
  templateUrl: './styles.component.html',
  styleUrls: ['./styles.component.scss']
})
export class StylesComponent implements OnInit {
  @Input()
  variant: 'bold' | 'caption';

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

  @HostBinding('class.variant--caption')
  get isCaption() {
    return this.variant === 'caption';
  }

  ngOnInit() {}

  // getColorStyles() {
  //   return css`
  //     ${this.color === 'muted' &&
  //       css`
  //         color: #757575;
  //       `}
  //     ${this.color === 'danger' &&
  //       css`
  //         color: #ff6059;
  //       `}
  //     ${this.color === 'success' &&
  //       css`
  //         color: #28ca42;
  //       `}
  //     ${this.color === 'info' &&
  //       css`
  //         color: #3498db;
  //       `}
  //   `;
  // }

  // getVariantStyles() {
  //   return css`
  //     ${this.variant === 'bold' &&
  //       css`
  //         font-weight: 600;
  //       `}
  //     ${this.variant === 'caption' &&
  //       css`
  //         font-size: 0.8em;
  //       `}
  //   `;
  // }

  // applyStyles() {
  //   console.log(this.getColorStyles());
  //   console.log(this.getVariantStyles());
  //   const el: HTMLElement = this.el.nativeElement;
  //   el.classList.add(this.getColorStyles());
  // }
}
