import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams } from '@angular/http';

import { ListsService } from '../lists.service';
import { CPSession } from '../../../../../session';

declare var $: any;

interface IState {
  isPristine: boolean;
}

const state: IState = {
  isPristine: true
};

@Component({
  selector: 'cp-lists-create',
  templateUrl: './lists-create.component.html',
  styleUrls: ['./lists-create.component.scss']
})
export class ListsCreateComponent implements OnInit, OnDestroy {
  @Input() users: Array<any> = [];
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() created: EventEmitter<any> = new EventEmitter();
  @Output() resetChips$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  chipOptions;
  typeAheadOpts;
  form: FormGroup;
  suggestions = [];
  state: IState = state;

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private service: ListsService,
  ) { }

  doSubmit() {
    this.created.emit(this.form.value);
    this.resetModal();
  }

  resetModal() {
    this.users = [];
    this.form.reset();
    this.reset.emit();
    $('#listsCreate').modal('hide');
    this.typeAheadOpts = Object.assign(
      {},
      this.typeAheadOpts,
      { reset: this.resetChips$.next(true) }
    );
  }

  onRemoveUser(id) {
    this.users = this.users.filter(user => user.id !== id);
  }

  ngOnDestroy() {
    this.resetModal();
  }

  onSearch(query) {
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
      suggestions => {
        this.typeAheadOpts = Object.assign({}, this.typeAheadOpts, { suggestions });
      },
      err => console.log(err)
      );
  }

  onHandleRemove(id) {
    console.log(id);
  }

  ngOnInit() {
    // let users = [];
    // for (let i = 1; i < 30; i++) {
    //   users.push(
    //     {
    //       'email': `${i}@oohlalamboile.com`
    //     }
    //   );
    // }
    // this.users = users;

    if (this.users) {
      this.state.isPristine = false;

      this.users = this.users.map((user, index) => {
        return {
          'label': user.email,
          'id': index,
        };
      });
    }

    if (this.state.isPristine) {
      this.typeAheadOpts = Object.assign(
        {},
        this.typeAheadOpts,
        { reset: this.resetChips$.next(true) }
      );
    }

    this.form = this.fb.group({
      'name': [null, Validators.required],
      'description': [null],
      'users': [null, Validators.required],
    });

    this.chipOptions = {
      icon: 'account_box',
      withClose: false,
      withAvatar: true
    };

    this.typeAheadOpts = {
      reset: this.resetChips$,
      suggestions: this.suggestions
    };
  }
}
