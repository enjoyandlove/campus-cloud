import {
  Input,
  Component,
  ElementRef,
  HostBinding,
  AfterContentInit,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'ready-ui-stack',
  templateUrl: './stack.component.html',
  styleUrls: ['./stack.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class StackComponent implements AfterContentInit {
  @Input()
  direction: 'horizontal' | 'vertical' = 'horizontal';

  @Input()
  alignment: 'start' | 'end' | 'center' | 'even' | 'between' = 'start';

  @Input()
  spacing: 'tight' | 'regular' | 'loose' = 'regular';

  constructor(private el: ElementRef) {}
  @HostBinding('class.ui-stack--direction-horizontal')
  get isHorizontal() {
    return this.direction === 'horizontal';
  }

  @HostBinding('class.ui-stack--direction-vertical')
  get isVertical() {
    return this.direction === 'vertical';
  }

  @HostBinding('class.alignment-start')
  get isStart() {
    return this.alignment === 'start';
  }

  @HostBinding('class.alignment-end')
  get isEnd() {
    return this.alignment === 'end';
  }

  @HostBinding('class.alignment-center')
  get isCenter() {
    return this.alignment === 'center';
  }

  @HostBinding('class.alignment-between')
  get isBetween() {
    return this.alignment === 'between';
  }

  @HostBinding('class.alignment-even')
  get isEven() {
    return this.alignment === 'even';
  }

  @HostBinding('class.ui-stack')
  ngAfterContentInit() {
    const el: HTMLElement = this.el.nativeElement;

    Array.from(el.children).forEach((child: HTMLElement) => {
      console.log(this.spacing);
      child.classList.add(`spacing-${this.spacing}`);
    });
  }
}
