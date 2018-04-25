import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AudienceType } from './../../../audience.status';
import { CPI18nService } from '../../../../../../shared/services';

@Component({
  selector: 'cp-audience-list-action-box',
  templateUrl: './audience-list-action-box.component.html',
  styleUrls: ['./audience-list-action-box.component.scss']
})
export class AudienceListActionBoxComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() filterBy: EventEmitter<number> = new EventEmitter();
  @Output() launchCreateModal: EventEmitter<null> = new EventEmitter();
  @Output() launchImportModal: EventEmitter<null> = new EventEmitter();

  listTypes;

  constructor(public cpI18n: CPI18nService) {}

  onListSelected(selected) {
    this.filterBy.emit(selected.action);
  }

  ngOnInit() {
    this.listTypes = [
      {
        label: this.cpI18n.translate('audience_type_all'),
        action: null
      },
      {
        label: this.cpI18n.translate('audience_type_custom'),
        action: AudienceType.custom
      },
      {
        label: this.cpI18n.translate('audience_type_dynamic'),
        action: AudienceType.dynamic
      }
    ];
  }
}
