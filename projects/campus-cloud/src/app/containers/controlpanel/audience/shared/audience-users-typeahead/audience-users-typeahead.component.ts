import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { CPSession } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';
import { AudienceService } from '@campus-cloud/containers/controlpanel/audience/audience.service';

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
      .pipe(
        map((users) => {
          if (!users) {
            return [{ label: this.cpI18n.translate('no_results') }];
          }

          return users.map(({ id, firstname, lastname, email }) => {
            return {
              id,
              label: `${firstname} ${lastname} (${email})`
            };
          });
        })
      )
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
