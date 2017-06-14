import { Observable } from 'rxjs/Observable';
import {
  Input,
  OnInit,
  Output,
  OnDestroy,
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  EventEmitter,
  HostListener
} from '@angular/core';

interface IState {
  ids: Array<number>;
  canSearch: boolean;
  chips: Array<{'label': string; 'id': number}>;
}

const state: IState = {
  ids: [],
  chips: [],
  canSearch: true
};

@Component({
  selector: 'cp-typeahead',
  templateUrl: './cp-typeahead.component.html',
  styleUrls: ['./cp-typeahead.component.scss']
})
export class CPTypeAheadComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('input') input: ElementRef;

  @Input() reset: Observable<boolean>;
  @Input() suggestions: Array<any>;

  @Output() query: EventEmitter<string> = new EventEmitter();
  @Output() selection: EventEmitter<Array<any>> = new EventEmitter();

  el;
  chipOptions;
  state: IState = state;

  constructor() { }

  @HostListener('document:click', ['$event'])
  onClick() {
    setTimeout(() => { this.suggestions = []; }, 100);
  }

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

    // hide suggestions
    this.resetList();

    // clear input
    this.el.value = null;

    // check for dupes
    if (this.state.ids.indexOf(suggestion.id) !== -1) { return; }

    this.state.ids.push(suggestion.id);
    this.state.chips.push(suggestion);

    this.selection.emit(this.state.ids);
  }

  resetList() {
    this.suggestions = [];
  }


  onHandleRemove(id) {
    this.state = Object.assign(
      {},
      this.state,
      {
        ids: this.state.ids.filter(_id => _id !== id),
        chips: this.state.chips.filter(chip => chip.id !== id)
      }
    );
    this.selection.emit(this.state.ids);
  }

  shouldFocusInput() {
    if (this.state.canSearch) {
      this.el.focus();
    }
  }

  teardown() {
    this.state.ids = [];
    this.state.chips = [];
  }

  ngOnDestroy() {
    this.teardown();
  }

  ngOnInit() {
    this.chipOptions = {
      close: true,
      avatar: true,
      icon: 'account_box'
    };

    // if (this.preSelected) {
    //   this.state.canSearch = false;

      // this.preSelected.forEach(selection => {
      //   this.state.selected.set(selection.id, selection);
      //   this.state.selectedJson = this.state.selected.toJSON();
      // });
    // }

    if (!this.reset) {
      this.reset = Observable.of(false);
    }

    this.reset.subscribe(reset => {
      if (reset) {
        this.teardown();
      }
    });
  }
}


