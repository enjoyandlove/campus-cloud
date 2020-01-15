import { Input, OnInit, Component, AfterContentInit } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { ResultItemComponent } from './../result-item/result-item.component';

@Component({
  selector: 'ready-ui-results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.scss']
})
export class ResultsListComponent implements OnInit {
  _loading = false;

  @Input()
  set loading(loading: string | boolean) {
    this._loading = coerceBooleanProperty(loading);
  }

  constructor() {}

  get listClassess() {
    return {
      'no-scroll': this._loading
    };
  }

  ngOnInit() {}
}
