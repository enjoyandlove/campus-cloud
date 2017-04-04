import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { BaseComponent } from '../../../../../base/base.component';
import { StoreService } from '../../../../../shared/services/store.service';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../../../reducers/header.reducer';
// import { EventsService } from '../events.service';

@Component({
  selector: 'cp-events-facebook',
  templateUrl: './events-facebook.component.html',
  styleUrls: ['./events-facebook.component.scss']
})
export class EventsFacebookComponent extends BaseComponent implements OnInit {
  stores;
  isAttendance;
  loading = true;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store<IHeader>,
    private storeService: StoreService
    // private service: EventsService
  ) {
    super();
    this.buildHeader();

    this.fetch();
  }

  buildForm() {
    this.form = this.fb.group({
      'links': this.fb.array([
        this.createLinkControl()
      ])
    });

    this.loading = false;
  }

  onSelectedHost(host, index) {
    console.log(host);
    console.log(index);
  }
  private fetch() {
    const stores$ = this.storeService.getStores().map(res => {
      const stores = [
        {
          'label': 'All Host',
          'action': null
        }
      ];
      res.forEach(store => {
        stores.push({
          'label': store.name,
          'action': store.id
        });
      });
      return stores;
    });

    super
      .fetchData(stores$)
      .then(res => {
        this.stores = res.data;
        this.buildForm();
      })
      .catch(err => console.log(err));
  }

  createLinkControl() {
    return this.fb.group({
      'link': ['', Validators.required],
      'store_id': ['', Validators.required]
    });
  }

  addLinkControl() {
    const control = <FormArray>this.form.controls['links'];
    control.push(this.createLinkControl());
  }

  removeService(index) {
    const control = <FormArray>this.form.controls['links'];
    control.removeAt(index);
  }

  onDeleteControl(index) {
    this.removeService(index);
  }

  doSinglePost(index) {
    const control = <FormArray>this.form.controls['links'];

    console.log(control.controls[index]);

    if (this.form.valid) {
      this.addLinkControl();
      return;
    }
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': 'Import Facebook Events',
        'subheading': '',
        'children': []
      }
    });
  }

  doSubmit() {
    console.log(this.form.value);
  }

  toogleIsFeedback(index, status) {
    const control = <FormArray>this.form.controls['links'];
    const group = <FormGroup>control.controls[index];

    group.controls['feedback'].setValue(status);
  }

  toggleIsAttendance(index, status) {
    const control = <FormArray>this.form.controls['links'];
    const group = <FormGroup>control.controls[index];

    group.controls['attendance'].setValue(status);
  }

  ngOnInit() { }
}
