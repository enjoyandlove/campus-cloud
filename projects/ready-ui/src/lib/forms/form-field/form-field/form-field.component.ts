import {
  Input,
  OnInit,
  Component,
  TemplateRef,
  ContentChild,
  AfterContentInit
} from '@angular/core';

import { merge, fromEvent, Observable } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';

import { ReadyInputDirective } from './../../input/ready-input.directive';

@Component({
  selector: 'ready-ui-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss']
})
export class FormFieldComponent implements OnInit, AfterContentInit {
  @ContentChild(ReadyInputDirective, { static: true }) private input: ReadyInputDirective;

  @Input()
  prefix: TemplateRef<any>;

  @Input()
  suffix: TemplateRef<any>;

  active$: Observable<boolean>;

  constructor() {}

  ngOnInit() {}

  ngAfterContentInit() {
    if (this.input) {
      (this.input.el.nativeElement as HTMLElement).classList.add('form-field-input');
      const blur$ = fromEvent(this.input.el.nativeElement, 'blur').pipe(mapTo(false));
      const focus$ = fromEvent(this.input.el.nativeElement, 'focus').pipe(mapTo(true));

      this.active$ = merge(blur$, focus$).pipe(startWith(false));
    }
  }
}
