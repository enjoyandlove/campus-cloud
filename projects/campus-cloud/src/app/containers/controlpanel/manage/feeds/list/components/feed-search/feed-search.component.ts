import { tap, distinctUntilChanged, debounceTime, skip } from 'rxjs/operators';
import { OnInit, Output, Component, EventEmitter } from '@angular/core';
import { Subject, Observable, BehaviorSubject, merge } from 'rxjs';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'cp-feed-search',
  templateUrl: './feed-search.component.html',
  styleUrls: ['./feed-search.component.scss']
})
export class FeedSearchComponent implements OnInit {
  @Output()
  feedSearch: EventEmitter<string> = new EventEmitter();

  form = this.fb.group({
    query: ['']
  });

  destroy$ = new Subject();

  query: BehaviorSubject<string> = new BehaviorSubject('');
  query$: Observable<string> = this.query.asObservable().pipe(
    skip(1),
    tap((value: string) => {
      if (value.length >= 3 || value.length === 0) {
        this.feedSearch.emit(value);
      }
    })
  );

  input = new Subject();
  input$ = this.input.asObservable().pipe(
    debounceTime(1000),
    distinctUntilChanged(),
    tap((value: string) => this.query.next(value))
  );

  value$ = merge(this.query$, this.input$);

  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  emitValue() {
    this.feedSearch.emit(this.query.value);
  }
}
