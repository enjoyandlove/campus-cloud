import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { CPI18nService } from './../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-audience-new-body',
  templateUrl: './audience-new-body.component.html',
  styleUrls: ['./audience-new-body.component.scss']
})
export class AudienceNewBodyComponent implements OnInit {
  @Input() importButton = true;
  @Input() withChips: Array<any> = [];
  @Input() disableTypeSelection = false;

  @Output() importClick: EventEmitter<null> = new EventEmitter();
  @Output() selected: EventEmitter<Array<number>> = new EventEmitter();

  message;
  audienceTypes;
  state = {
    custom: false,
    dynamic: true
  };

  constructor(public cpI18n: CPI18nService) {}

  onTypeSelected({ action }) {
    this.state = {
      ...this.state,
      custom: action === 'custom',
      dynamic: action === 'dynamic'
    };
  }

  onUsers(users) {
    this.selected.emit(users);
    this.message = `${users.length} ${this.cpI18n.translate('audience_counter_users')}`;
  }

  ngOnInit(): void {
    this.audienceTypes = [
      {
        action: 'dynamic',
        label: this.cpI18n.translate('audience_type_dynamic')
      },
      {
        action: 'custom',
        label: this.cpI18n.translate('audience_type_custom')
      }
    ];

    this.message = `${this.withChips.length} ${this.cpI18n.translate('audience_counter_users')}`;
  }
}
