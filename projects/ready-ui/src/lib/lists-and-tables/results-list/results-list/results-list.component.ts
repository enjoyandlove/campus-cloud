import {
  Input,
  OnInit,
  Component,
  QueryList,
  HostBinding,
  HostListener,
  AfterContentInit,
  ContentChildren,
  ChangeDetectionStrategy
} from '@angular/core';

import { ResultItemComponent } from './../result-item/result-item.component';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusKeyManager } from '@angular/cdk/a11y';

@Component({
  selector: 'ready-ui-results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { tabindex: '0' }
})
export class ResultsListComponent implements OnInit, AfterContentInit {
  @ContentChildren(ResultItemComponent, { descendants: true }) items: QueryList<
    ResultItemComponent
  >;
  private keyManager: FocusKeyManager<ResultItemComponent>;

  _loading = false;

  @Input()
  set loading(loading: string | boolean) {
    this._loading = coerceBooleanProperty(loading);
  }

  get listClassess() {
    return {
      'no-scroll': this._loading
    };
  }

  constructor() {}

  @HostListener('keydown', ['$event'])
  manage(event) {
    this.keyManager.onKeydown(event);
  }

  ngOnInit() {}

  ngAfterContentInit(): void {
    this.keyManager = new FocusKeyManager(this.items).withWrap();
  }
}
