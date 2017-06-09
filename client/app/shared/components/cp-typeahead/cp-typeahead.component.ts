import { Observable } from 'rxjs/Observable';
import {
  Input,
  OnInit,
  Output,
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  EventEmitter
} from '@angular/core';

interface IState {
  canSearch: boolean;
  selectedJson: Array<any>;
  selected: Map<number, Object>;
}

const state: IState = {
  selectedJson: [],
  canSearch: true,
  selected: new Map()
};

@Component({
  selector: 'cp-typeahead',
  templateUrl: './cp-typeahead.component.html',
  styleUrls: ['./cp-typeahead.component.scss']
})
export class CPTypeAheadComponent implements OnInit, AfterViewInit {
  @Input() suggestions: Array<any>;
  @Input() preSelected: Array<any>;
  @Input() reset: Observable<boolean>;
  @ViewChild('input') input: ElementRef;
  @Output() query: EventEmitter<string> = new EventEmitter();

  el;
  chipOptions;
  state: IState = state;

  constructor() { }

  listenForKeyChanges() {
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

  ngAfterViewInit() {
    if (this.state.canSearch) {
      this.listenForKeyChanges();
    }
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

  shouldFocusInput() {
    if (this.state.canSearch) {
      this.el.focus();
    }
  }

  ngOnInit() {
    this.chipOptions = {
      close: true,
      avatar: true,
      icon: 'account_box'
    };

    if (this.preSelected) {
      this.state.canSearch = false;

      this.preSelected.forEach(selection => {
        this.state.selected.set(selection.id, selection);
        this.state.selectedJson = this.state.selected.toJSON();
      });
    }

    if (!this.reset) {
      this.reset = Observable.of(false);
    }

    this.reset.subscribe(reset => {
      if (reset) {
        this.state = {
          selectedJson: [],
          canSearch: true,
          selected: new Map()
        };
      }
    });
  }
}


