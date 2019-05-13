import {
  Input,
  OnInit,
  Component,
  ElementRef,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'ready-ui-group',
  template: '<ng-content></ng-content>',
  styleUrls: ['./group.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupComponent implements OnInit {
  @Input() direction: 'block' | 'inline' = 'inline';
  @Input() align: 'left' | 'center' | 'between' | 'right' = 'left';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const _el: HTMLElement = this.el.nativeElement;
    _el.classList.add('ready-ui-group', this.align, this.direction);
  }
}
