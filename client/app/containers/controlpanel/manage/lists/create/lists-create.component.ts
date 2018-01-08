import {
    Input,
    OnInit,
    Output,
    Component,
    OnDestroy,
    ElementRef,
    HostListener,
    EventEmitter,
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams } from '@angular/http';

import { ListsService } from '../lists.service';
import { CPSession } from '../../../../../session';
import { STATUS } from '../../../../../shared/constants';
import { CPI18nService } from '../../../../../shared/services/index';

declare var $: any;

interface IState {
  isPristine: boolean;
}

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

  isError;
  chipOptions;
  errorMessage;
  typeAheadOpts;
  form: FormGroup;
  suggestions = [];
  isFormValid = false;
  state: IState = {
    isPristine: true
  };

  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private session: CPSession,
    private service: ListsService,
    private cpI18n: CPI18nService
  ) { }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  doSubmit() {
    this.isError = false;
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    const data = Object.assign({}, this.form.value);

    if (this.state.isPristine) {
      delete data.user_emails;
    }

    if (!this.state.isPristine) {
      delete data.user_ids;
    }

    this
      .service
      .createList(data, search)
      .subscribe(
      _ => {
        this.created.emit(data);
        this.resetModal();
      },
      err => {
        this.isError = true;
        const error = JSON.parse(err._body).error;
        if (error === 'Database Error') {
          this.errorMessage = 'A list with that name already exists';
          return;
        }
        this.errorMessage = STATUS.SOMETHING_WENT_WRONG;
      }
      );
  }

  resetModal() {
    this.users = [];
    this.form.reset();
    this.reset.emit();
    this.isError = false;
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
    const search = new URLSearchParams();
    search.append('search_str', query);
    search.append('school_id', this.session.g.get('school').id.toString());

    this
      .service
      .getUsers(search)
      .map(users => {
        const _users = [];

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

  onTypeAheadChange(ids) {
    if (!ids.length) {
      this.form.controls['user_ids'].setValue(null);
      return;
    }

    this.form.controls['user_ids'].setValue(ids);
  }

  ngOnInit() {
    this.form = this.fb.group({
      'name': [null, Validators.required],
      'description': [null],
      'user_ids': [null],
      'user_emails': [null]
    });

    this.form.valueChanges.subscribe(_ => {
      let valid = true;

      valid = this.form.valid;

      if (!this.state.isPristine) {
        valid = false;

        if (this.form.controls['user_emails'].value) {
          valid = this.form.controls['user_emails'].value.length > 0 && this.form.valid;
        }
      }

      if (this.state.isPristine) {
        valid = false;

        if (this.form.controls['user_ids'].value) {
          valid = this.form.controls['user_ids'].value.length > 0 && this.form.valid;
        }
      }

      this.isFormValid = valid;
    });

    if (this.users) {
      this.state.isPristine = false;
      const emails = [];

      this.users.forEach(user => { emails.push(user.email); });

      this.users = this.users.map((user, index) => {
        return {
          'label': user.email,
          'id': index,
        };
      });

      this.form.controls['user_emails'].setValue(emails);
    }

    if (this.state.isPristine) {
      this.typeAheadOpts = Object.assign(
        {},
        this.typeAheadOpts,
        { reset: this.resetChips$.next(true) }
      );
    }

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
