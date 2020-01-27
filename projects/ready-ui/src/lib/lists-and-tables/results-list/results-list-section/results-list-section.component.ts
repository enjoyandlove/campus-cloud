import {
  Input,
  OnInit,
  Component,
  QueryList,
  ContentChildren,
  AfterContentInit,
  ChangeDetectionStrategy
} from '@angular/core';

import { ResultItemComponent } from './../result-item/result-item.component';

@Component({
  selector: 'ready-ui-results-list-section',
  templateUrl: './results-list-section.component.html',
  styleUrls: ['./results-list-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsListSectionComponent implements OnInit, AfterContentInit {
  @ContentChildren(ResultItemComponent, { descendants: true }) private results: QueryList<
    ResultItemComponent
  >;

  @Input()
  name: string;

  itemsCount = 0;

  constructor() {}

  ngOnInit() {}

  ngAfterContentInit() {
    this.itemsCount = this.results.length;
  }
}
