import { Input, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ready-ui-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnInit {
  @Input()
  title: string;

  @Input()
  spacing: 'regular' | 'tight' | 'loose' = 'regular';

  @Input()
  shadow: 'regular' | 'light' | 'dark' = 'regular';

  constructor() {}

  ngOnInit() {}

  get classes() {
    return {
      [`ready-ui-card--shadow-${this.shadow}`]: true,
      [`ready-ui-card--spacing-${this.spacing}`]: true
    };
  }
}
