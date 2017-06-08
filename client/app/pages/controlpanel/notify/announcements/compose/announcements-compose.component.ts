import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { CPSession } from '../../../../../session';
import { AnnouncementsService } from '../announcements.service';
import { StoreService } from '../../../../../shared/services';

declare var $: any;

interface IState {
  isCampusWide: boolean;
  userSerch: boolean;
}

const state: IState = {
  isCampusWide: false,
  userSerch: true
};

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
  suggestions = [];
  state: IState = state;
  shouldConfirm = false;
  types = require('./announcement-types').types;

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private storeService: StoreService,
    private service: AnnouncementsService
  ) {
    const school = this.session.school;
    let search: URLSearchParams = new URLSearchParams();
    search.append('school_id', school.id.toString());

    this.stores$ = this.storeService.getStores(search);
  }

  private doUserSearch(query) {
    let search = new URLSearchParams();
    search.append('search_str', query);
    search.append('school_id', this.session.school.id.toString());

    this
      .service
      .getUsers(search)
      .map(users => {
        let _users = [];

        users.forEach(user => {
          _users.push({
            'label': `${user.firstname} ${user.lastname}`,
            'id': user.id
          });
        });

        if (!_users.length) {
          _users.push({ 'label': 'No Results...' });
        }

        return _users;
      })
      .subscribe(
      res => this.suggestions = res,
      err => console.log(err)
      );
  }

  onSearch(query) {
    if (this.state.userSerch) {
      this.doUserSearch(query);
    }
  }

  resetModal() {
    this.teardown.emit();
    $('#composeModal').modal('hide');
  }

  onSelectedStore(store) {
    this.form.controls['store_id'].setValue(store.value);
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
