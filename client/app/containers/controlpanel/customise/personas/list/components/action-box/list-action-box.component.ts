import { PersonasType } from './../../../personas.status';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { CPI18nService } from '../../../../../../../shared/services';

@Component({
  selector: 'cp-personas-list-action-box',
  templateUrl: './list-action-box.component.html',
  styleUrls: ['./list-action-box.component.scss']
})
export class PersonasListActionBoxComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() filterBy: EventEmitter<null> = new EventEmitter();

  dropdownItems;

  constructor(public cpI18n: CPI18nService) {}

  onSearch(query) {
    this.search.emit(query);
  }

  onSelectedFilter({ id }) {
    this.filterBy.emit(id);
  }

  ngOnInit() {
    this.dropdownItems = [
      {
        id: null,
        label: this.cpI18n.translate('t_personas_list_dropdown_all_experiences')
      },
      {
        id: PersonasType.mobile,
        label: this.cpI18n.translate('t_personas_list_dropdown_mobile_experiences')
      },
      {
        id: PersonasType.web,
        label: this.cpI18n.translate('t_personas_list_dropdown_web_experiences')
      }
    ];
  }
}
