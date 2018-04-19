import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { CPI18nService } from './../../../shared/services/i18n.service';

@Component({
  selector: 'cp-audience-card',
  templateUrl: './audience-card.component.html',
  styleUrls: ['./audience-card.component.scss']
})
export class AudienceCardComponent implements OnInit {
  @Output() importClick: EventEmitter<null> = new EventEmitter();
  @Output() selectedAudience: EventEmitter<number> = new EventEmitter();
  @Output() selectedUsers: EventEmitter<Array<number>> = new EventEmitter();

  message;
  newAudienceTitle;
  savedAudienceTitle;

  constructor(public cpI18n: CPI18nService) {}

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

  ngOnInit(): void {
    this.message = this.cpI18n.translate('campus_wide');
    this.newAudienceTitle = this.cpI18n.translate('new_audience_tab_title');
    this.savedAudienceTitle = this.cpI18n.translate('saved_audience_tab_title');
  }
}
