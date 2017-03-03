import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { BUTTON_DROPDOWN } from './services-filters';
// import { StoreService } from '../../../../../../../shared/services';
import {
  BUTTON_ALIGN,
  BUTTON_THEME
} from '../../../../../../../shared/components/cp-button-dropdown';

interface IState {
  search_str: string;
  attendance_only: number;
}

const state = {
  search_str: null,
  attendance_only: 1,
};

declare var $: any;

@Component({
  selector: 'cp-services-list-action-box',
  templateUrl: './list-action-box.component.html',
  styleUrls: ['./list-action-box.component.scss']
})
export class ServicesListActionBoxComponent implements OnInit {
  @Output() listAction: EventEmitter<IState> = new EventEmitter();

  loading;
  buttonDropdown;
  state: IState = state;
  buttonDropdownOptions;

  constructor() { }

  onSearch(search_str): void {
    this.state = Object.assign({}, this.state, { search_str });
    this.listAction.emit(this.state);
  }

  onAttendanceToggle(attendance_only) {
    attendance_only = attendance_only ? 1 : 0;
    this.state = Object.assign({}, this.state, { attendance_only });

    this.listAction.emit(this.state);
  }

  onButtonDropdown() {
    $('#excelServicesModal').modal();
  }

  ngOnInit() {
    this.buttonDropdown = BUTTON_DROPDOWN;

    this.buttonDropdownOptions = {
      align: BUTTON_ALIGN.RIGHT,
      theme: BUTTON_THEME.PRIMARY
    };
  }
}
