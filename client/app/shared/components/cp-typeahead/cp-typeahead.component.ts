import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cp-typeahead',
  templateUrl: './cp-typeahead.component.html',
  styleUrls: ['./cp-typeahead.component.scss']
})
export class CPTypeAheadComponent implements OnInit, AfterViewInit {
  @ViewChild('input') input: ElementRef;

  el;
  searching;

  constructor() { }

  ngAfterViewInit() {
    this.el = this.input.nativeElement;

    const stream$ = Observable.fromEvent(this.el, 'keyup');

    stream$
    .map((res: any) => {
      this.searching = true;
      return res.target.value;
    })
    .debounceTime(400)
    .distinctUntilChanged()
    .subscribe(
      res => {
        console.log(res);
        this.searching = false;
      },
      err => {
        console.log(err);
        this.searching = false;
      }
    );
  }

  ngOnInit() { }
}
