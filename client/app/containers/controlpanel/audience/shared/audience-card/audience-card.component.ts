/*tslint:disable:max-line-length*/
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChildren,
  AfterViewInit,
  QueryList
} from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CPTabComponent } from './../../../../../shared/components/cp-tabs/components/cp-tab/cp-tab.component';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-audience-card',
  templateUrl: './audience-card.component.html',
  styleUrls: ['./audience-card.component.scss']
})
export class AudienceCardComponent implements OnInit, AfterViewInit {
  @ViewChildren(CPTabComponent) tabs: QueryList<CPTabComponent>;

  @Output() importClick: EventEmitter<null> = new EventEmitter();
  @Output() resetNewAduience: EventEmitter<null> = new EventEmitter();
  @Output() resetSavedAduience: EventEmitter<null> = new EventEmitter();
  @Output() selectedAudience: EventEmitter<number> = new EventEmitter();
  @Output() selectedUsers: EventEmitter<Array<number>> = new EventEmitter();
  @Output() selectedFilters: EventEmitter<Array<number>> = new EventEmitter();

  message;
  newAudienceTitle;
  savedAudienceTitle;
  importedAudience$: BehaviorSubject<{ label: string; action: number }> = new BehaviorSubject(null);

  constructor(public cpI18n: CPI18nService, public store: Store<any>) {}

  onTabClick({ id }) {
    if (id === 'saved') {
      this.resetNewAduience.emit();
    }
    if (id === 'new') {
      this.resetSavedAduience.emit();
    }
  }

  ngAfterViewInit() {
    this.store
      .select('AUDIENCE')
      .subscribe(({ audience_id, new_audience_active, saved_audience_active }) => {
        this.importedAudience$.next(audience_id);

        if (new_audience_active) {
          this.tabs.toArray()[1].active = true;
          this.tabs.toArray()[0].active = false;
        }
        if (saved_audience_active) {
          this.tabs.toArray()[0].active = true;
          this.tabs.toArray()[1].active = false;
        }
      });
  }

  onSelectedAudience(audience) {
    // Campus Wide will return action: null
    const fromAudience = !!audience.action;

    this.message = fromAudience
      ? `${audience.userCount} ${this.cpI18n.translate('users_found')}`
      : this.cpI18n.translate('campus_wide');

    this.selectedAudience.emit(audience.action);
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
