import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, map, filter, takeUntil } from 'rxjs/operators';
import {
  Output,
  Input,
  Component,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  EventEmitter
} from '@angular/core';

import { CPI18nService } from '@campus-cloud/shared/services';

let nextUniqueId = 0;

@Component({
  selector: 'cp-searchbox',
  templateUrl: './cp-searchbox.component.html',
  styleUrls: ['./cp-searchbox.component.scss']
})
export class CPSearchBoxComponent implements AfterViewInit, OnDestroy {
  @Input() fixed: true;
  @Input() placeholder: string;

  @ViewChild('q', { static: true }) q: ElementRef;

  @Output() query: EventEmitter<string> = new EventEmitter();
  @Output() searching: EventEmitter<boolean> = new EventEmitter();

  stream$: Observable<string>;
  destroy$ = new Subject();
  isSearch$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
  }

  protected _id = `cp-searchbox-${nextUniqueId++}`;

  protected _uid = `cp-searchbox-${nextUniqueId++}`;

  constructor(public cpI18n: CPI18nService) {}

  ngAfterViewInit() {
    const input = this.q.nativeElement;
    this.stream$ = fromEvent(input, 'keyup');

    this.stream$
      .pipe(
        takeUntil(this.destroy$),
        map((event: any) => event.target.value),
        filter((query: string) => query.trim().length > 0),
        map((query: string) => {
          const invalidChars = ['%', '_', '"', '\\', ';', '`'];
          invalidChars.forEach((c) => (query = query.replace(c, '')));
          return query;
        }),
        map((query: string) => {
          this.searching.emit(true);

          return query;
        }),
        debounceTime(501)
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClear() {
    this.query.emit(null);
    this.isSearch$.next(false);
    this.q.nativeElement.value = '';
  }
}
