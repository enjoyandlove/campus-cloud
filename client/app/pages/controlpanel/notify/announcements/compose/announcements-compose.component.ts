import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { CPSession } from '../../../../../session';
import { StoreService } from '../../../../../shared/services';

declare var $: any;

@Component({
  selector: 'cp-announcements-compose',
  templateUrl: './announcements-compose.component.html',
  styleUrls: ['./announcements-compose.component.scss']
})
export class AnnouncementsComposeComponent implements OnInit {
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  stores$;
  isCampusWide;
  form: FormGroup;
  shouldConfirm = false;
  types = require('./announcement-types').types;

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private storeService: StoreService
  ) {
    const school = this.session.school;
    let search: URLSearchParams = new URLSearchParams();
    search.append('school_id', school.id.toString());

    this.stores$ = this
      .storeService
      .getStores(search)
      .startWith([
        {
          'label': '---',
          'action': null
        }
      ])
      .map(res => {
      const stores = [
        {
          'label': '---',
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
  }

  resetModal() {
    // this.form.reset();
    this.teardown.emit();
    $('#composeModal').modal('hide');
  }

  onSelectedStore(store) {
    console.log(store);
  }

  doValidate() {
    if (this.isCampusWide) {
      this.shouldConfirm = true;
      return;
    }

    this.doSubmit();
  }

  doSubmit() {
    console.log(this.form.value);
  }

  onConfirmed() {
    this.doSubmit();
  }

  onTypeChanged(type): void {
    this.form.controls['priority'].setValue(type);
  }

  ngOnInit() {
    this.form = this.fb.group({
      'school_id': [this.session.school.id, Validators.required],
      'user_id': [157, Validators.required],
      'store_id': [157, Validators.required],
      'subject': [null, [Validators.required, Validators.maxLength(128)]],
      'message': [null, [Validators.required, Validators.maxLength(512)]],
      'priority': [this.types[0], Validators.required],
    });
  }
}
