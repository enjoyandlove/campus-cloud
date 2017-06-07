import { Observable } from 'rxjs/Observable';
import {
  Input,
  OnInit,
  Output,
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  EventEmitter } from '@angular/core';

interface IState {
  selected: Map<number, Object>;
  selectedJson: Array<any>;
}

const state: IState = {
  selected: new Map(),
  selectedJson: []
};

@Component({
  selector: 'cp-typeahead',
  templateUrl: './cp-typeahead.component.html',
  styleUrls: ['./cp-typeahead.component.scss']
})
export class CPTypeAheadComponent implements OnInit, AfterViewInit {
  @Input() suggestions: Array<any> = [];
  @ViewChild('input') input: ElementRef;
  @Output() query: EventEmitter<string> = new EventEmitter();

  el;
  chipOptions;
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
      res => {
        const query = (res.split(',')[res.split(',').length - 1]).trim();

        if (!query) {
          this.resetList();
          return;
        }

        this.query.emit(query);
      },
      err => {
        console.log(err);
      }
      );
  }

  onHandleClick(suggestion) {
    if (!suggestion.id) { return; }

    this.resetList();
    this.state.selected.set(suggestion.id, suggestion);
    this.state.selectedJson = this.state.selected.toJSON();
    this.el.value = null;
  }

  resetList() {
    this.suggestions = [];
  }

  onHandleRemove(id) {
    this.state.selected.delete(id);
    this.state.selectedJson = this.state.selected.toJSON();
  }
  ngOnInit() {
    this.chipOptions = {
      close: true,
      avatar: true,
      icon: 'account_box'
    };
  }
}


