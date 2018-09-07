import { Component, Input, Output, EventEmitter } from "@angular/core";
import { IMessage } from '../../../announcements.interface';

@Component({
  selector: 'cp-announcement-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class AnnouncementsListSummaryComponent {
  @Input() message: IMessage;

  @Output() viewMoreModal: EventEmitter<null> = new EventEmitter();
}
