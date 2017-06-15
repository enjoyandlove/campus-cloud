import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { CPSession } from '../../../../../session';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { StoreService } from '../../../../../shared/services';
import { AnnouncementsService } from '../announcements.service';
import { CP_PRIVILEGES_MAP } from '../../../../../shared/utils';

declare var $: any;

interface IState {
  isUrgent: boolean;
  userSerch: boolean;
  isToUsers: boolean;
  isToLists: boolean;
  isEmergency: boolean;
  isCampusWide: boolean;
}

const state: IState = {
  userSerch: true,
  isUrgent: false,
  isToUsers: true,
  isToLists: false,
  isEmergency: false,
  isCampusWide: false
};

@Component({
  selector: 'cp-announcements-compose',
  templateUrl: './announcements-compose.component.html',
  styleUrls: ['./announcements-compose.component.scss']
})
export class AnnouncementsComposeComponent implements OnInit, OnDestroy {
  @Output() created: EventEmitter<any> = new EventEmitter();
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  stores$;

  sendAsName;
  typeAheadOpts;
  form: FormGroup;
  resetCustomFields$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  URGENT_TYPE = 1;
  EMERGENCY_TYPE = 0;

  suggestions = [];

  state: IState = state;
  shouldConfirm = false;

  subject_prefix = {
    label: null,
    type: null
  };

  types;

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
      suggestions => {
        this.typeAheadOpts = Object.assign(
          {},
          this.typeAheadOpts,
          { suggestions }
        );
      },
      err => console.log(err)
      );
  }

  getSubjectLength() {
    let length = 0;

    if (this.subject_prefix.label) {
      length += this.subject_prefix.label.length;
    }

    if (this.form.controls['subject'].value) {
      length += this.form.controls['subject'].value.length;
    }
    return length;
  }

  onSearch(query) {
    if (this.state.userSerch) {
      this.doUserSearch(query);
    }
  }

  getTypeFromArray(id) {
    return this.types.filter(type => type.id === id)[0];
  }

  resetModal() {
    this.form.reset();
    this.teardown.emit();
    this.resetCustomFields$.next(true);
    $('#composeModal').modal('hide');
  }

  onSelectedStore(store) {
    this.sendAsName = store.label;
    this.form.controls['store_id'].setValue(store.value);
  }

  doValidate() {
    if (this.state.isCampusWide) {
      this.shouldConfirm = true;
      return;
    }
    this.doSubmit();
  }

  doSubmit() {
    let search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    let prefix = this.subject_prefix.label ? this.subject_prefix.label.toUpperCase() : '';

    let data = {
      'store_id': this.form.value.store_id,
      'subject': `${prefix} ${this.form.value.subject}`,
      'message': `${this.form.value.message} \n ${this.sendAsName}`,
      'priority': this.form.value.priority
    };

    this
      .service
      .postAnnouncements(search, data)
      .subscribe(
        _ => {
          this.form.reset();
          this.created.emit(this.form.value);
          this.resetModal();
        },
        err => console.log(err)
      );
  }

  onConfirmed() {
    this.doSubmit();
  }

  onTypeChanged(type): void {
    this.subject_prefix = {
      label: null,
      type: null
    };
    this.state.isUrgent = false;
    this.state.isEmergency = false;

    if (type.action === this.EMERGENCY_TYPE) {
      this.state.isEmergency = true;
      this.subject_prefix = {
        label: 'Emergency',
        type: 'danger'
      };
    }

    if (type.action === this.URGENT_TYPE) {
      this.state.isUrgent = true;
      this.subject_prefix = {
        label: 'Urgent',
        type: 'warning'
      };
    }

    this.form.controls['priority'].setValue(type.action);
  }

  ngOnDestroy() {
    this.resetModal();
  }

  onTypeAheadChange(list) {
    console.log(list);
  }

  ngOnInit() {
    this.typeAheadOpts = {
      suggestions: this.suggestions,
      reset: this.resetCustomFields$
    };
    let schoolPrivileges = this.session.user.school_level_privileges[this.session.school.id];

    let canDoEmergency = schoolPrivileges[CP_PRIVILEGES_MAP.emergency_announcement].w;
    this.types = require('./announcement-types').types;

    if (!canDoEmergency) {
      this.types = this.types.filter(type => type.action !== this.EMERGENCY_TYPE);
    }

    this.form = this.fb.group({
      'store_id': [null, Validators.required],
      'subject': [null, [Validators.required, Validators.maxLength(128)]],
      'message': [null, [Validators.required, Validators.maxLength(400)]],
      'priority': [this.types[0].action, Validators.required]
    });
  }
}
