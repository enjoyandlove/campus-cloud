import {
  Input,
  Output,
  Component,
  OnInit,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import { CPI18nService } from '@campus-cloud/shared/services';
import { IAnnouncement, AnnouncementStatus } from './../../../model';

@Component({
  selector: 'cp-scheduled-action-cell',
  templateUrl: './action-cell.component.html',
  styleUrls: ['./action-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduledActionCellComponent implements OnInit {
  @Input()
  announcement: IAnnouncement;

  @Output()
  deleteClick: EventEmitter<null> = new EventEmitter();

  isExternalToolTip = this.cpI18n.translate('t_announcements_list_external_source_tooltip');

  constructor(private cpI18n: CPI18nService) {}

  ngOnInit() {}

  get hasError() {
    return this.announcement.status === AnnouncementStatus.error;
  }

  get isPending() {
    return this.announcement.status === AnnouncementStatus.pending;
  }

  get isExternal() {
    return this.announcement.is_external;
  }
}
