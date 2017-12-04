
import { Component, Input } from '@angular/core';

@Component({
  selector: 'cp-attendees-list',
  templateUrl: './attendees-list.component.html',
  styleUrls: ['./attendees-list.component.scss']
})

export class CheckinAttendeesListComponent {
  @Input() attendees: Array<any>;
}
