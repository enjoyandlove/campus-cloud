import { Component, Input, Output, EventEmitter } from '@angular/core';

import { IAnnouncement } from '../../../model';

@Component({
  selector: 'cp-announcement-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class AnnouncementsListSummaryComponent {
  @Input() message: IAnnouncement;

  @Output() viewMoreModal: EventEmitter<null> = new EventEmitter();
}
