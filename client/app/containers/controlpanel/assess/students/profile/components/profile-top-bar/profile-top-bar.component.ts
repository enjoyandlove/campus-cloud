import { Component, OnInit, EventEmitter, Output } from '@angular/core';

const ALL_ENGAGEMENTS = 0;
const SERVICES_ENGAGEMENTS = 1;
const EVENTS_ENGAGEMENTS = 2;

@Component({
  selector: 'cp-profile-top-bar',
  templateUrl: './profile-top-bar.component.html',
  styleUrls: ['./profile-top-bar.component.scss']
})
export class StudentsProfileTopBarComponent implements OnInit {
  @Output() filter: EventEmitter<number> = new EventEmitter();
  @Output() download: EventEmitter<null> = new EventEmitter();

  dropdown = [
    {
      'label': 'All Engagements',
      'action': ALL_ENGAGEMENTS
    },
    {
      'label': 'All Events',
      'action': EVENTS_ENGAGEMENTS
    },
    {
      'label': 'All Services',
      'action': SERVICES_ENGAGEMENTS
    }
  ]

  constructor() { }

  ngOnInit() { }
}
