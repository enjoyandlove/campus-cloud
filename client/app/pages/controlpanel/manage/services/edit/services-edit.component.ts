import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { ServicesService } from '../services.service';
import { BaseComponent } from '../../../../../base/base.component';
import { IHeader, HEADER_UPDATE } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-services-edit',
  templateUrl: './services-edit.component.html',
  styleUrls: ['./services-edit.component.scss']
})
export class ServicesEditComponent extends BaseComponent implements OnInit {
  center;
  loading;
  service;
  form: FormGroup;
  formError = false;
  serviceId: number;
  attendance = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private serviceService: ServicesService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
    this.serviceId = this.route.snapshot.params['serviceId'];
    this.fetch();
    this.buildHeader();
  }

  private fetch() {
    const stream$ = this.serviceService.getServiceById(this.serviceId);
    super
      .fetchData(stream$)
      .then(res => {
        this.service = res;
        this.center = { lat: res.latitude, lng: res.longitude };

        this.buildForm();
      })
      .catch(err => console.error(err));
  }

  buildForm() {
    this.form = this.fb.group({
      'name': [this.service.name, Validators.required],
      'category': [this.service.category, Validators.required],
      'contactphone': [this.service.contactphone, Validators.required],
      'email': [this.service.email, Validators.required],
      'website': [this.service.website, Validators.required],
      'description': [this.service.description],
      'location': [this.service.location],
      'room_data': [this.service.room_data],
      'address': [this.service.address]
    });
  }

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': 'Edit Service',
        'subheading': null,
        'em': null,
        'children': []
      }
    });
  }

  onSubmit() {
    console.log(this.form.value);
    this.formError = false;

    if (!this.form.valid) {
      this.formError = true;
      return;
    }
  }

  onDelete() {
    console.log('hello');
  }

  ngOnInit() { }
}
