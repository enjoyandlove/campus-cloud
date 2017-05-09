import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { ProvidersService } from '../../../providers.service';

@Component({
  selector: 'cp-services-edit-create-provider',
  templateUrl: './services-edit-create-provider.component.html',
  styleUrls: ['./services-edit-create-provider.component.scss']
})
export class ServicesEditCreateProviderComponent implements OnInit {
  @Input() serviceId: number;
  @Output() created: EventEmitter<any> = new EventEmitter();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private providersService: ProvidersService
  ) { }

  onSubmit(data) {
    let search = new URLSearchParams();
    search.append('service_id', this.serviceId.toString());


    this
      .providersService
      .createProvider(data, search)
      .subscribe(
        res => {
          this.created.emit(res);
          this.form.reset();
        });
  }

  ngOnInit() {
    this.form = this.fb.group({
      'provider_name': [null, Validators.required],
      'email': [null, Validators.required],
      'custom_basic_feedback_label': [null, Validators.required]
    });
  }
}
