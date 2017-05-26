import {
  Input,
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
  @Input() fixed: true;
  @Input() placeholder: string;
  @ViewChild('q') q: ElementRef;
  @Output() query: EventEmitter<string> = new EventEmitter();
  @Output() searching: EventEmitter<boolean> = new EventEmitter();

  stream$: Observable<string>;

  constructor() { }

  ngAfterViewInit() {
    const input = this.q.nativeElement;
    this.stream$ = Observable.fromEvent(input, 'keyup');

    this
      .stream$
      .map(res => {
        this.searching.emit(true);
        return res;
      })
      .debounceTime(501)
      .map((res: any) => res.target.value)
      .distinctUntilChanged()
      .subscribe(query => {
        if (!query) {
          this.query.emit(null);
          this.searching.emit(false);
          return;
        }
        this.query.emit(query);
        this.searching.emit(false);
      });
  }

  ngOnInit() { }
}
