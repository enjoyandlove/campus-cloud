import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-providers-add',
  templateUrl: './providers-add.component.html',
  styleUrls: ['./providers-add.component.scss']
})
export class ServicesProviderAddComponent implements OnInit {
  form: FormGroup;
  formErrors;

  constructor(
    private fb: FormBuilder
  ) { }

  onSubmit() {
    console.log(this.form.value);
    this.formErrors = false;

    if (!this.form.valid) {
      console.log('invalid');
      this.formErrors = true;
      return;
    }
  }

  doReset() {
    this.form.reset();
    this.formErrors = false;
  }

  ngOnInit() {
    this.form = this.fb.group({
      'name': [null, Validators.required],
      'email': [null, Validators.required],
      'question': [null],
      'qr_code': [null],
    });
  }
}
