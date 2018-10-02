import { FormGroup, FormBuilder } from '@angular/forms';
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
import { takeWhile, map } from 'rxjs/operators';

@Component({
  selector: 'cp-personas-section-title',
  templateUrl: './section-title.component.html',
  styleUrls: ['./section-title.component.scss']
})
export class PersonasSectionTitleComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input()
  set name(name) {
    this._name = name;
    this.state = { ...this.state, saving: false };
  }

  @Input() noNameChange = false;

  @ViewChild('inputEl') inputEl: ElementRef;

  @Output() nameChanged: EventEmitter<string> = new EventEmitter();

  _name;
  isAlive = true;
  form: FormGroup;

  state = {
    saving: false
  };

  constructor(public fb: FormBuilder) {}

  listenToInputBlur() {
    const stream$ = fromEvent(this.inputEl.nativeElement, 'blur');

    stream$
      .pipe(takeWhile(() => this.isAlive), map((e: any) => e.target.value))
      .subscribe((title) => {
        this.form.get('name').setValue(title);
        this.onSubmit();
      });
  }

  onSubmit() {
    if (this.noNameChange) {
      return;
    }

    const nameChanged = this._name !== this.form.get('name').value;

    if (nameChanged) {
      this.state = { ...this.state, saving: true };

      this.nameChanged.emit(this.form.get('name').value);
    }
  }

  ngAfterViewInit() {
    if (!this.noNameChange) {
      this.listenToInputBlur();
    }
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [{ value: this._name, disabled: this.noNameChange }]
    });
  }
}
