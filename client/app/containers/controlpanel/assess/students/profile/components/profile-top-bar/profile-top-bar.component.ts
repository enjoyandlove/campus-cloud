import { Component, OnInit, EventEmitter, Output } from '@angular/core';

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
      'action': null
    },
    {
      'label': 'All Events',
      'action': 1
    },
    {
      'label': 'All Services',
      'action': 2
    }
  ]

  constructor() { }

  ngOnInit() { }
}
