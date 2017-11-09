import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams } from '@angular/http';

import { ListsService } from '../lists.service';
import { CPSession } from '../../../../../session';
import { CPI18nService } from '../../../../../shared/services/index';

declare var $: any;

@Component({
  selector: 'cp-lists-edit',
  templateUrl: './lists-edit.component.html',
  styleUrls: ['./lists-edit.component.scss']
})
export class ListsEditComponent implements OnInit {
  @Input() list: any;
  @Output() edited: EventEmitter<any> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();

  chipOptions;
  typeAheadOpts;
  form: FormGroup;
  hasUsersListChanged;
  resetChips$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private service: ListsService,
    private cpI18n: CPI18nService
  ) { }

  doSubmit() {
    let search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    let data = Object.assign({}, this.form.value);

    if (!this.hasUsersListChanged) {
      data = Object.assign(
        {},
        this.form.value,
        {
          user_ids: this.form.value.user_ids.map(user => user.id)
        }
      );
    }

    this
      .service
      .updateList(this.list.id, data, search)
      .subscribe(
      _ => {
        $('#listsEdit').modal('hide');
        this.edited.emit(this.form.value);
        this.resetModal();
      },
      err => { throw new Error(err) }
      );
  }

  resetModal() {
    this.form.reset();
    this.reset.emit();
    this.typeAheadOpts = Object.assign(
      {},
      this.typeAheadOpts,
      { reset: this.resetChips$.next(true) }
    );
  }

  onHandleRemove(id) {
    this.hasUsersListChanged = true;
    if (this.hasUsersListChanged) {
      this.list = Object.assign(
        {},
        this.list,
        {
          users: this.list.users.filter(user => user.id !== id)
        }
      );
    }

    this.form.controls['user_ids'].setValue(this.list.users);
  }

  buildChips() {
    let chips = [];

    this.list.users.map(user => {
      chips.push(
        {
          'label': `${user.email}`,
          'id': user.id
        }
      );
    });

    return chips;
  }

  onSelection(ids) {
    this.hasUsersListChanged = true;
    this.form.controls['user_ids'].setValue(ids);
  }

  onSearch(query) {
    let search = new URLSearchParams();
    search.append('search_str', query);
    search.append('school_id', this.session.g.get('school').id.toString());

    this
      .service
      .getUsers(search)
      .map(users => {
        let _users = [];

        users.forEach(user => {
          _users.push({
            'label': `${user.email}`,
            'id': user.id
          });
        });

        if (!_users.length) {
          _users.push({ 'label': `${this.cpI18n.translate('no_results')}...` });
        }

        return _users;
      })
      .subscribe(
      suggestions => {
        this.typeAheadOpts = Object.assign({}, this.typeAheadOpts, { suggestions });
      },
      err => { throw new Error(err) }
      );
  }

  ngOnInit() {
    this.chipOptions = {
      icon: 'account_box',
      withClose: true,
      withAvatar: true
    };

    let users = this.buildChips();

    this.typeAheadOpts = {
      suggestions: [],
      withSwitcher: false,
      defaultValues: users
    };

    this.list = Object.assign(
      {},
      this.list,
      { users }
    );

    this.form = this.fb.group({
      'name': [this.list.name, Validators.required],
      'description': [this.list.description || null],
      'user_ids': [this.list.users, Validators.required],
    });
  }
}
