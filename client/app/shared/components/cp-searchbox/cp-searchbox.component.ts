import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { CPI18nService } from './../../services/i18n.service';

@Component({
  selector: 'cp-searchbox',
  templateUrl: './cp-searchbox.component.html',
  styleUrls: ['./cp-searchbox.component.scss']
})
export class CPSearchBoxComponent implements AfterViewInit, OnInit {
  @Input() fixed: true;
  @Input() placeholder: string;
  @ViewChild('q') q: ElementRef;
  @Output() query: EventEmitter<string> = new EventEmitter();
  @Output() searching: EventEmitter<boolean> = new EventEmitter();

  stream$: Observable<string>;
  isSearch$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(public cpI18n: CPI18nService) {}

  onClear() {
    this.query.emit(null);
    this.isSearch$.next(false);
    this.q.nativeElement.value = '';
  }

  ngAfterViewInit() {
    const input = this.q.nativeElement;
    this.stream$ = Observable.fromEvent(input, 'keyup');

    this.stream$
      .map((res) => {
        this.searching.emit(true);

        return res;
      })
      .debounceTime(501)
      .map((res: any) => res.target.value)
      .distinctUntilChanged()
      .subscribe((query) => {
        if (!query) {
          this.query.emit(null);
          this.searching.emit(false);
          this.isSearch$.next(false);

          return;
        }

        this.query.emit(query);
        this.isSearch$.next(true);
        this.searching.emit(false);
      });
  }

  ngOnInit() {}
}
