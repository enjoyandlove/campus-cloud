import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { BehaviorSubject, fromEvent, Observable, merge } from 'rxjs';
import {
  AfterViewInit,
  EventEmitter,
  ElementRef,
  Component,
  ViewChild,
  OnInit,
  Output,
  Input
} from '@angular/core';

import { CPI18nService } from '@campus-cloud/shared/services';

const RESET = Symbol('reset');

@Component({
  selector: 'cp-searchbox',
  templateUrl: './cp-searchbox.component.html',
  styleUrls: ['./cp-searchbox.component.scss']
})
export class CPSearchBoxComponent implements AfterViewInit, OnInit {
  @Input() fixed: true;
  @Input() placeholder: string;

  @ViewChild('q', { static: true }) q: ElementRef;

  @Output() query: EventEmitter<string> = new EventEmitter();
  @Output() searching: EventEmitter<boolean> = new EventEmitter();

  stream$: Observable<string>;
  reset$: BehaviorSubject<symbol> = new BehaviorSubject(RESET);
  isSearch$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(public cpI18n: CPI18nService) {}

  onClear() {
    this.query.emit(null);
    this.isSearch$.next(false);
    this.q.nativeElement.value = '';
    this.reset$.next(RESET);
  }

  ngAfterViewInit() {
    const input = this.q.nativeElement;
    this.stream$ = fromEvent(input, 'keyup');

    merge(
      this.reset$,
      this.stream$.pipe(
        map((res) => {
          this.searching.emit(true);

          return res;
        }),
        debounceTime(501),
        map((res: any) => res.target.value)
      )
    )
      .pipe(
        distinctUntilChanged(),
        filter((value) => value !== RESET)
      )
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
