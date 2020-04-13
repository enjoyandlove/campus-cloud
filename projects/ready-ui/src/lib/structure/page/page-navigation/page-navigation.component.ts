import {
  OnInit,
  Component,
  HostBinding,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'ready-ui-page-navigation',
  templateUrl: './page-navigation.component.html',
  styleUrls: ['./page-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PageNavigationComponent implements OnInit {
  constructor() {}

  @HostBinding('class.ready-ui-page-navigation')
  ngOnInit() {}
}
