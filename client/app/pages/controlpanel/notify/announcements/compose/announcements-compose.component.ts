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

    this.stores$ = this.storeService.getStores(search);
  }

  resetModal() {
    this.teardown.emit();
    $('#composeModal').modal('hide');
  }

  onSelectedStore(store) {
    this.form.controls['store_id'].setValue(store.action);
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
      'user_id': [this.session.user.id, Validators.required],
      'store_id': [null, Validators.required],
      'subject': [null, [Validators.required, Validators.maxLength(128)]],
      'message': [null, [Validators.required, Validators.maxLength(512)]],
      'priority': [this.types[0], Validators.required],
    });
  }
}
