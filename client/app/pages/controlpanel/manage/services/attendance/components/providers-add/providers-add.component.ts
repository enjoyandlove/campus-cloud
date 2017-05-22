import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { ProvidersService } from '../../../providers.service';

declare var $: any;

@Component({
  selector: 'cp-providers-add',
  templateUrl: './providers-add.component.html',
  styleUrls: ['./providers-add.component.scss']
})
export class ServicesProviderAddComponent implements OnInit {
  @Input() serviceId: number;
  @Output() created: EventEmitter<any> = new EventEmitter();

  formErrors;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private providersService: ProvidersService
  ) { }

  onSubmit() {
    let search = new URLSearchParams();
    search.append('service_id', this.serviceId.toString());

    this
      .providersService
      .createProvider(this.form.value, search)
      .subscribe(
        res => {
          this.form.reset();
          $('#createProvider').modal('hide');
          this.created.emit(res);
        });
  }

  doReset() {
    this.form.reset();
    this.formErrors = false;
  }

  ngOnInit() {
    this.form = this.fb.group({
      'provider_name': [null, Validators.required],
      'email': [null, Validators.required],
      'custom_basic_feedback_label': [null, Validators.required],
    });
  }
}
