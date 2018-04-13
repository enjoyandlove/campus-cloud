import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CPSession } from '../../../../session';
import { CPI18nService } from '../../../../shared/services/index';
import { AudienceService } from '../audience.service';

declare var $: any;

@Component({
  selector: 'cp-audience-edit',
  templateUrl: './audience-edit.component.html',
  styleUrls: ['./audience-edit.component.scss']
})
export class AuidenceEditComponent implements OnInit {
  @Input() audience: any;
  @Output() edited: EventEmitter<any> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();

  chipOptions;
  typeAheadOpts;
  form: FormGroup;
  hasUsersAudienceChanged;
  resetChips$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private session: CPSession,
    private service: AudienceService,
    private cpI18n: CPI18nService
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  doSubmit() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    let data = Object.assign({}, this.form.value);

    if (!this.hasUsersAudienceChanged) {
      data = Object.assign({}, this.form.value, {
        user_ids: this.form.value.user_ids.map((user) => user.id)
      });
    }

    this.service.updateAudience(this.audience.id, data, search).subscribe(
      (_) => {
        $('#audienceEdit').modal('hide');
        this.edited.emit(this.form.value);
        this.resetModal();
      },
      (err) => {
        throw new Error(err);
      }
    );
  }

  resetModal() {
    this.form.reset();
    this.reset.emit();
    this.typeAheadOpts = Object.assign({}, this.typeAheadOpts, {
      reset: this.resetChips$.next(true)
    });
  }

  onHandleRemove(id) {
    this.hasUsersAudienceChanged = true;
    if (this.hasUsersAudienceChanged) {
      this.audience = Object.assign({}, this.audience, {
        users: this.audience.users.filter((user) => user.id !== id)
      });
    }

    this.form.controls['user_ids'].setValue(this.audience.users);
  }

  buildChips() {
    return this.audience.users.map((user) => {
      return {
        label: `${user.email}`,
        id: user.id
      };
    });
  }

  onSelection(type) {
    this.hasUsersAudienceChanged = true;

    this.form.controls['user_ids'].setValue(type.ids);
  }

  onSearch(query) {
    const search = new URLSearchParams();
    search.append('search_str', query);
    search.append('school_id', this.session.g.get('school').id.toString());

    this.service
      .getUsers(search)
      .map((users) => {
        const _users = [];

        users.forEach((user) => {
          _users.push({
            label: `${user.email}`,
            id: user.id
          });
        });

        if (!_users.length) {
          _users.push({ label: `${this.cpI18n.translate('no_results')}...` });
        }

        return _users;
      })
      .subscribe((suggestions) => {
        this.typeAheadOpts = Object.assign({}, this.typeAheadOpts, {
          suggestions
        });
      });
  }

  ngOnInit() {
    this.chipOptions = {
      icon: 'account_box',
      withClose: true,
      withAvatar: true
    };

    const users = this.buildChips();

    this.typeAheadOpts = {
      suggestions: [],
      withSwitcher: false,
      defaultValues: users
    };

    this.audience = Object.assign({}, this.audience, { users });

    this.form = this.fb.group({
      name: [this.audience.name, Validators.required],
      description: [this.audience.description || null],
      user_ids: [this.audience.users, Validators.required]
    });
  }
}
