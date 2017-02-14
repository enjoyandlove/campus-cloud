import {
  OnInit,
  Output,
  ViewChild,
  Component,
  ElementRef,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cp-searchbox',
  templateUrl: './cp-searchbox.component.html',
  styleUrls: ['./cp-searchbox.component.scss']
})
export class CPSearchBoxComponent implements AfterViewInit, OnInit {
  @Output() query: EventEmitter<string> = new EventEmitter();
  @ViewChild('q') q: ElementRef;

  stream$: Observable<string>;

  constructor() { }

  ngAfterViewInit() {
    const input = this.q.nativeElement;
    this.stream$ = Observable.fromEvent(input, 'keyup');

    this
      .stream$
      .debounceTime(300)
      .map((res: any) => res.target.value)
      .distinctUntilChanged()
      .subscribe(query => this.query.emit(query));
  }

  ngOnInit() { }
}
