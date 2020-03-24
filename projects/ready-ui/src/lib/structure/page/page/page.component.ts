import { Input, OnInit, Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ready-ui-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageComponent implements OnInit {
  @Input()
  heading: string;

  @Input()
  subheading: string;

  constructor() {}
  ngOnInit() {}
}
