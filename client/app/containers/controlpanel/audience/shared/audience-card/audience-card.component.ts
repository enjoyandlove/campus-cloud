/*tslint:disable:max-line-length*/
import {
  Input,
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChildren,
  AfterViewInit,
  QueryList
} from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

import { baseActions } from './../../../../../store/base';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { getAudienceState } from './../../../../../store/base/base.selectors';
import { CPTabComponent } from './../../../../../shared/components/cp-tabs/components/cp-tab/cp-tab.component';

@Component({
  selector: 'cp-audience-card',
  templateUrl: './audience-card.component.html',
  styleUrls: ['./audience-card.component.scss']
})
export class AudienceCardComponent implements OnInit, AfterViewInit {
  @ViewChildren(CPTabComponent) tabs: QueryList<CPTabComponent>;

  @Input() canReadAudience = false;

  @Output() count: EventEmitter<number> = new EventEmitter();
  @Output() importClick: EventEmitter<null> = new EventEmitter();
  @Output() resetNewAudience: EventEmitter<null> = new EventEmitter();
  @Output() saveAudienceClick: EventEmitter<null> = new EventEmitter();
  @Output() resetSavedAudience: EventEmitter<null> = new EventEmitter();
  @Output() selectedAudience: EventEmitter<number> = new EventEmitter();
  @Output() selectedUsers: EventEmitter<Array<number>> = new EventEmitter();
  @Output() selectedFilters: EventEmitter<Array<number>> = new EventEmitter();
  @Output()
  newAudienceTypeChange: EventEmitter<{ custom: boolean; dynamic: boolean }> = new EventEmitter();

  message;
  newAudienceTitle;
  savedAudienceTitle;
  importedAudience$: BehaviorSubject<number> = new BehaviorSubject(null);

  // this will ensure ngOnDestroy is
  // called on these components
  state = {
    savedAudienceActive: true,
    newAudienceActive: false
  };

  constructor(public cpI18n: CPI18nService, public store: Store<any>) {}

  onTabClick({ id }) {
    if (id === 'saved') {
      this.resetSavedAudience.emit();
    }
    if (id === 'new') {
      this.resetNewAudience.emit();
    }
  }

  onDestroyNewAudience() {
    this.store.dispatch({
      type: baseActions.AUDIENCE_IMPORTED,
      payload: {
        audience_id: null,
        new_audience_active: false,
        saved_audience_active: true
      }
    });
    this.message = this.cpI18n.translate('campus_wide');
  }

  onDestroySavedAudience() {
    this.store.dispatch({
      type: baseActions.AUDIENCE_IMPORTED,
      payload: {
        audience_id: null,
        new_audience_active: true,
        saved_audience_active: false
      }
    });
  }

  ngAfterViewInit() {
    this.store
      .select(getAudienceState)
      .subscribe(({ audience_id, new_audience_active, saved_audience_active }) => {
        this.importedAudience$.next(audience_id);

        // admin with no access to audience
        if (this.tabs.toArray().length === 1) {
          this.tabs.toArray()[0].active = true;

          this.state = {
            ...this.state,
            savedAudienceActive: true,
            newAudienceActive: false
          };

          return;
        }

        if (new_audience_active) {
          this.tabs.toArray()[1].active = true;
          this.tabs.toArray()[0].active = false;

          this.state = {
            ...this.state,
            savedAudienceActive: false,
            newAudienceActive: true
          };
        }
        if (saved_audience_active) {
          this.tabs.toArray()[0].active = true;
          this.tabs.toArray()[1].active = false;

          this.state = {
            ...this.state,
            savedAudienceActive: true,
            newAudienceActive: false
          };
        }
      });
  }

  onNewAudienceTypeChange(selection) {
    this.newAudienceTypeChange.emit(selection);
  }

  onSelectedAudience(audience) {
    this.count.emit(audience.userCount || 'campus_wide');

    // Campus Wide will return action: null
    const fromAudience = !!audience.action;

    this.message = fromAudience
      ? `${audience.userCount} ${this.cpI18n.translate('users_found')}`
      : this.cpI18n.translate('campus_wide');

    this.selectedAudience.emit(audience);
  }

  onUsers(users) {
    this.selectedUsers.emit(users);
  }

  onFilters(filters) {
    this.selectedFilters.emit(filters);
  }

  ngOnInit(): void {
    this.message = this.cpI18n.translate('campus_wide');
    this.newAudienceTitle = this.cpI18n.translate('new_audience_tab_title');
    this.savedAudienceTitle = this.cpI18n.translate('saved_audience_tab_title');
  }
}
