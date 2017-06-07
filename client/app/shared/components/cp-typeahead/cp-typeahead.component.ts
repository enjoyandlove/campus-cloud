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
  chipOptions;
  suggestions = [];
  state: IState = state;

  constructor() { }

  ngAfterViewInit() {
    this.el = this.input.nativeElement;

    const keyup$ = Observable.fromEvent(this.el, 'keyup');

    keyup$
      .map((res: any) => {
        return res.target.value;
      })
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe(
      _ => {
        // const query = (res.split(',')[res.split(',').length - 1]).trim();
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
      },
      err => {
        console.log(err);
      }
      );
  }

  updateInputValue() {
    let value = '';

    this.state.selected.forEach(selection => {
      value += `${selection.label}, `;
    });

    this.el.value = value;
  }

  onHandleClick(suggestion) {
    this.suggestions = [];
    this.state.selected.add(suggestion);
    // this.state = Object.assign(
    //   {},
    //   this.state,
    //   { selected: this.state.selected.add(suggestion) }
    // );

    this.el.value = null;
    // this.updateInputValue();
  }

  onHandleRemove(suggestion) {
    this.state.selected.forEach((item: any) => {
      if (item.id === suggestion) {
        this.state.selected.delete(item);
      }
    });

    // this.updateInputValue();
  }

  ngOnInit() {
    this.chipOptions = {
      close: true,
      avatar: true,
      icon: 'account_box'
    };
  }
}
