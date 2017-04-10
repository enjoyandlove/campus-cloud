import { Component, OnInit, Output, EventEmitter } from '@angular/core';

interface IState {
  event_manager_id: number;
  event_attendance: number;
  attendance_manager_email: string;
  event_feedback: number;
}

const actionState = {
  event_attendance: 0,
  event_manager_id: null,
  attendance_manager_email: null,
  event_feedback: 1
};

@Component({
  selector: 'cp-import-action-dropdown',
  templateUrl: './import-action-dropdown.component.html',
  styleUrls: ['./import-action-dropdown.component.scss']
})
export class EventsImportActionDropdownComponent implements OnInit {
  @Output() bulkAction: EventEmitter<IState> = new EventEmitter();
  isOpen = false;
  id1 = 'id1';
  id2 = 'id2';
  eventManagers;
  state = actionState;
  eventAttendanceFeedback;

  constructor() { }

  toggleEventAttendance() {
    let value = this.state.event_attendance === 0 ? 1 : 0;

    this.state = Object.assign(
      {},
      this.state,
      { event_attendance: value }
    );
    return;
  }

  updateEventManager(manager) {
    this.state = Object.assign(
      {},
      this.state,
      { event_manager_id: manager });
    return;
  }

  updateAttendanceManager(manager) {
    this.state = Object.assign(
      {},
      this.state,
      { attendance_manager_email: manager });
    return;
  }

  updateAttendanceFeedback(feedback) {
    this.state = Object.assign(
      {},
      this.state,
      { event_feedback: feedback });
    return;
  }

  defaultState() {
    this.state = Object.assign(
      {},
      this.state,
      actionState);
    return;
  }

  doSubmit() {
    if (this.state.event_attendance === 0) {
      this.defaultState();
    }

    this.bulkAction.emit(this.state);
    this.isOpen = false;
  }

  ngOnInit() {
    this.eventAttendanceFeedback = [
      {
        'label': 'Enabled',
        'event': 1
      },
      {
        'label': 'Disabled',
        'event': 0
      }
    ];

    this.eventManagers = [
      {
        'label': 'Dummy',
        'event': 16776
      },
      {
        'label': 'Hello',
        'event': 16776
      }
    ];
  }
}
