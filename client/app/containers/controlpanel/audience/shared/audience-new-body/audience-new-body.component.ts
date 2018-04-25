import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { AudienceType } from './../../audience.status';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-audience-new-body',
  templateUrl: './audience-new-body.component.html',
  styleUrls: ['./audience-new-body.component.scss']
})
export class AudienceNewBodyComponent implements OnInit {
  @Input() audience;
  @Input() importButton = true;
  @Input() withChips: Array<any> = [];
  @Input() disableTypeSelection = false;
  @Input() defaultView = AudienceType.dynamic;

  @Output() filters: EventEmitter<any> = new EventEmitter();
  @Output() importClick: EventEmitter<null> = new EventEmitter();
  @Output() users: EventEmitter<Array<number>> = new EventEmitter();
  @Output() audienceType: EventEmitter<{ custom: boolean; dynamic: boolean }> = new EventEmitter();

  message;
  audienceTypes;
  selectedType = null;
  state = {
    custom: true,
    dynamic: false
  };

  constructor(public cpI18n: CPI18nService) {}

  onTypeSelected({ action }) {
    this.state = {
      ...this.state,
      custom: action === AudienceType.custom,
      dynamic: action === AudienceType.dynamic
    };

    this.message = null;

    this.audienceType.emit(this.state);
  }

  getUserCount() {
    // console.log(filters);
    this.message = 'Missing';
  }

  onUsers(users) {
    this.users.emit(users);
    this.message = `${users.length} ${this.cpI18n.translate('audience_counter_users')}`;
  }

  onFilters(filters) {
    this.getUserCount();

    this.filters.emit(filters);
  }

  ngOnInit(): void {
    this.state = {
      custom: this.defaultView === AudienceType.custom,
      dynamic: this.defaultView === AudienceType.dynamic
    };

    this.audienceTypes = [
      {
        action: AudienceType.custom,
        label: this.cpI18n.translate('audience_type_custom')
      },
      {
        action: AudienceType.dynamic,
        label: this.cpI18n.translate('audience_type_dynamic')
      }
    ];

    this.selectedType = this.audienceTypes.filter(
      (audience) => audience.action === this.defaultView
    )[0];

    if (this.audience) {
      this.message = `${this.audience.count} ${this.cpI18n.translate('audience_counter_users')}`;
    }

    this.audienceType.emit(this.state);
  }
}
