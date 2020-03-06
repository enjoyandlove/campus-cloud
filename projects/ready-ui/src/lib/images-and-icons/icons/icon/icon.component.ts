import { Input, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

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
  height: string;

  @Input()
  width: string;

  @Input()
  color = 'inherit';

  constructor() {}

  ngOnInit() {}

  get svgClasses() {
    return {
      small: this.size === 'small',
      regular: this.size === 'regular'
    };
  }

  get absUrl() {
    return window.location.href.split('#')[0];
  }
}
