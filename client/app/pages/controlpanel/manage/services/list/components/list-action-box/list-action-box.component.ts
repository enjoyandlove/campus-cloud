import { Component, OnInit, Output, EventEmitter } from '@angular/core';

// import { StoreService } from '../../../../../../../shared/services';

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
  state: IState = state;

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

  launchModal() {
    $('#excelServicesModal').modal();
  }

  ngOnInit() { }
}
