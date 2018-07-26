import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeWhile, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'cp-personas-section-title',
  templateUrl: './section-title.component.html',
  styleUrls: ['./section-title.component.scss']
})
export class PersonasSectionTitleComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input()
  set name(name) {
    this._name = name;
  }

  @Input() isEditing = true;

  @ViewChild('inputEl') inputEl: ElementRef;

  @Output() nameChanged: EventEmitter<string> = new EventEmitter();

  _name;
  isAlive = true;

  constructor() {}

  listenToInputChanges() {
    const stream$ = fromEvent(this.inputEl.nativeElement, 'keydown');

    stream$
      .pipe(
        takeWhile(() => this.isAlive),
        debounceTime(500),
        distinctUntilChanged(),
        map((e: any) => e.target.value)
      )
      .subscribe((title) => {
        if (title) {
          this.nameChanged.emit(title);
        }
      });
  }

  ngAfterViewInit() {
    this.listenToInputChanges();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  ngOnInit(): void {}
}
