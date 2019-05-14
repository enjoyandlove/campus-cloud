import {
  OnInit,
  Component,
  ElementRef,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'ready-ui-navigation-brand',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./navigation-brand.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationBrandComponent implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    const _el: HTMLElement = this.el.nativeElement;

    _el.classList.add('ready-ui-navigation-brand');
  }
}
