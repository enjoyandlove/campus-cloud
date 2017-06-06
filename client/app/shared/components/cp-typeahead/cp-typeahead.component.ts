import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

interface IState {
  selected: Set<{ label: string; id: number }>;
}

const state: IState = {
  selected: new Set()
};

@Component({
  selector: 'cp-typeahead',
  templateUrl: './cp-typeahead.component.html',
  styleUrls: ['./cp-typeahead.component.scss']
})
export class CPTypeAheadComponent implements OnInit, AfterViewInit {
  @ViewChild('input') input: ElementRef;

  el;
  searching;
  chipOptions;
  suggestions = [];
  state: IState = state;

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
      _ => {
        this.searching = false;
      },
      err => {
        console.log(err);
        this.searching = false;
      }
      );
  }

  onHandleClick(suggestion) {
    this.state = Object.assign(
      {},
      this.state,
      { selected: this.state.selected.add(suggestion) }
    );
  }

  onHandleRemove(suggestion) {
    console.log(suggestion);
    this.state.selected.forEach((item: any) => {
      if (item.id === suggestion) {
        this.state.selected.delete(item);
      }
    });
  }

  ngOnInit() {
    this.chipOptions = {
      close: true,
      avatar: true,
      icon: 'account_box'
    };
    this.suggestions = [
      {
        'label': 'John Smith',
        'id': 1
      },
      {
        'label': 'Joe Smith',
        'id': 2
      },
      {
        'label': 'Sylvester Stallone',
        'id': 3
      },
      {
        'label': 'Harrison Ford',
        'id': 4
      },
      {
        'label': 'Nicholas Cage',
        'id': 5
      },
      {
        'label': 'Arnold Schwarzenegger',
        'id': 6
      }
    ];
  }
}
