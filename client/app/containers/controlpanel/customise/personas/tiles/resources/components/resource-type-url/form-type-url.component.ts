import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { validUrl } from '@client/app/shared/utils/forms';

@Component({
  selector: 'cp-personas-resource-type-url',
  templateUrl: './form-type-url.component.html',
  styleUrls: ['./form-type-url.component.scss']
})
export class PersonasResourceTypeUrlComponent implements OnInit {
  _value: string;

  @Input()
  set value(val: string) {
    this._value = val;
    if (this.form) {
      this.form.get('url').setValue(this._value);
    }
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter();

  isAlive = true;
  form: FormGroup;
  invalidInput = false;
  errorMessage: string;

  constructor(private fb: FormBuilder) {}

  buildForm() {
    this.form = this.fb.group({
      url: [this._value, [Validators.required, Validators.pattern(validUrl)]]
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.form.valueChanges.subscribe(() => this.valueChange.emit(this.form.value.url));
  }
}
