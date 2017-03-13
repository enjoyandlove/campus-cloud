import { Component, OnInit, Output, EventEmitter } from '@angular/core';

interface IState {
  event_manager: number;
  event_attendance: boolean;
  attendance_manager: string;
  event_attendance_feedback: number;
}

const actionState = {
  event_attendance: false,
  event_manager: null,
  attendance_manager: null,
  event_attendance_feedback: 2
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
    this.state = Object.assign({}, this.state,
    { event_attendance: !this.state.event_attendance });
    return;
  }

  updateEventManager(manager) {
    this.state = Object.assign({}, this.state,
    { event_manager: manager });
    return;
  }

  updateAttendanceManager(manager) {
    this.state = Object.assign({}, this.state,
    { attendance_manager: manager });
    return;
  }

  updateAttendanceFeedback(feedback) {
    this.state = Object.assign({}, this.state,
    { event_attendance_feedback: feedback });
    return;
  }

  defaultState() {
    this.state = Object.assign({}, this.state, actionState);
  }

  doSubmit() {
    if (!this.state.event_attendance) {
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
        'event': 2
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
