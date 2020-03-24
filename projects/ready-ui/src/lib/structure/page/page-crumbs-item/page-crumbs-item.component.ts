import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'a[ready-ui-page-crumbs-item]',
  templateUrl: './page-crumbs-item.component.html',
  styleUrls: ['./page-crumbs-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageCrumbsItemComponent implements OnInit {
  @Input()
  to: string;

  constructor() {}

  ngOnInit() {}
}
