import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'cp-tile-type-text',
  templateUrl: './tile-type-text.component.html',
  styleUrls: ['./tile-type-text.component.scss']
})
export class PersonasTileTypeTextComponent implements OnInit, OnDestroy {
  @Input() label: string;
  @Input() controlName: string;

  @ViewChild('inputEl') inputEl: ElementRef;

  @Output() valueChange: EventEmitter<string> = new EventEmitter();

  isAlive = true;

  constructor() {}

  listenForInputChanges() {
    const el = this.inputEl.nativeElement;
    const stream$ = fromEvent(el, 'keyup');

    stream$
      .pipe(takeWhile(() => this.isAlive), map((e: any) => e.target.value))
      .subscribe((input) => this.valueChange.emit(input));
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  ngOnInit(): void {
    this.listenForInputChanges();
  }
}
