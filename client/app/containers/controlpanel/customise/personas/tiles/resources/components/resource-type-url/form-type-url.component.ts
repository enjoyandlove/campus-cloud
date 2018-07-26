import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Input,
  ViewChild
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'cp-personas-resource-type-url',
  templateUrl: './form-type-url.component.html',
  styleUrls: ['./form-type-url.component.scss']
})
export class PersonasResourceTypeUrlComponent implements OnInit, OnDestroy {
  @Input() value: string;

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
