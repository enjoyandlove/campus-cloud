import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { CPSession } from './../../../../../session/index';
// import { STATUS } from './../../../../../shared/constants/status';

declare var $;

@Component({
  selector: 'cp-templates-delete',
  templateUrl: './templates-delete.component.html',
  styleUrls: ['./templates-delete.component.scss']
})
export class TemplatesDeleteComponent implements OnInit {
  @Input() item: any;
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  isError;
  errorMessage;

  constructor(
    private session: CPSession
  ) { }

  doReset() {
    this.isError = false;
    this.teardown.emit();
  }

  onDelete() {
    this.isError = false;
    let search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    this.deleted.emit(this.item.id);
    $('#deleteAnnouncementModal').modal('hide');
    this.doReset();

    // this
    //   .service
    //   .deleteAnnouncement(this.item.id, search)
    //   .subscribe(
    //     _ => {
    //       this.teardown.emit();
    //       this.deleted.emit(this.item.id);
    //       $('#deleteAnnouncementModal').modal('hide');
    //     },
    //     _ => {
    //       this.isError = true;
    //       this.errorMessage = STATUS.SOMETHING_WENT_WRONG;
    //     }
    //   );
  }

  ngOnInit() { }
}
