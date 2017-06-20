import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { CPSession } from '../../../../../session';
import { STATUS } from '../../../../../shared/constants';
import { AnnouncementsService } from '../announcements.service';

declare var $: any;

@Component({
  selector: 'cp-announcements-delete',
  templateUrl: './announcements-delete.component.html',
  styleUrls: ['./announcements-delete.component.scss']
})
export class AnnouncementDeleteComponent implements OnInit {
  @Input() item: any;
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  isError;
  errorMessage;

  constructor(
    private session: CPSession,
    private service: AnnouncementsService
  ) { }

  doReset() {
    this.isError = false;
    this.teardown.emit();
  }

  onArchive() {
    this.isError = false;
    let search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    this
      .service
      .deleteAnnouncement(this.item.id, search)
      .subscribe(
        _ => {
          this.teardown.emit();
          this.deleted.emit(this.item.id);
          $('#deleteAnnouncementModal').modal('hide');
        },
        _ => {
          this.isError = true;
          this.errorMessage = STATUS.SOMETHING_WENT_WRONG;
        }
      );
  }

  ngOnInit() { }
}
