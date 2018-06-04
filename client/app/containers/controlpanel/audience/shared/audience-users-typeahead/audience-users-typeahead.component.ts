/*tslint:disable:max-line-length */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '../../../../../session';
import { AudienceService } from './../../../../../containers/controlpanel/audience/audience.service';
import { CPI18nService } from '../../../../../shared/services';

@Component({
  selector: 'cp-audience-users-typeahead',
  templateUrl: './audience-users-typeahead.component.html',
  styleUrls: ['./audience-users-typeahead.component.scss']
})
export class AudienceUsersTypeaheadComponent implements OnInit {
  @Input() withChips: Array<any> = [];

  @Output() users: EventEmitter<Array<number>> = new EventEmitter();

  chips = [];
  typeAheadOpts;
  resetChips$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    public session: CPSession,
    public service: AudienceService,
    public cpI18n: CPI18nService
  ) {}

  onTypeAheadChange({ chips, ids }) {
    this.chips = chips;
    this.users.emit(ids);
  }

  resetChips() {
    this.resetChips$.next(true);
  }

  onSearch(query) {
    const search = new HttpParams()
      .append('search_str', query)
      .append('school_id', this.session.g.get('school').id.toString());

    this.service
      .getUsers(search)
      .map((users) => {
        const _users = [];

        users.forEach((user) => {
          _users.push({
            label: `${user.firstname} ${user.lastname}`,
            id: user.id
          });
        });

        if (!_users.length) {
          _users.push({ label: this.cpI18n.translate('no_results') });
        }

        return _users;
      })
      .subscribe((suggestions) => {
        this.typeAheadOpts = Object.assign({}, this.typeAheadOpts, {
          suggestions
        });
      });
  }

  ngOnInit(): void {
    this.typeAheadOpts = {
      isLists: false,
      isUsers: true,
      canSearch: true,
      unsetOverflow: true,
      reset: this.resetChips$,
      defaultValues: this.withChips
    };
  }
}
