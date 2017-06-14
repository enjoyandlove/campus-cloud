import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-attendees-list',
  templateUrl: './attendees-list.component.html',
  styleUrls: ['./attendees-list.component.scss']
})
export class CheckinAttendeesListComponent implements OnInit {
  @Input() attendees: Array<any>;

  constructor() { }

  ngOnInit() { }
}
