import { Input, HostBinding, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ready-ui-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent implements OnInit {
  @Input()
  name: string;

  @Input()
  size: 'small' | 'regular' = 'regular';

  @Input()
  color = '757575';

  constructor() {}

  ngOnInit() {}

  @HostBinding('class.icon--small')
  get isSmall() {
    return this.size === 'small';
  }

  get absUrl() {
    return window.location.href.split('#')[0];
  }
}