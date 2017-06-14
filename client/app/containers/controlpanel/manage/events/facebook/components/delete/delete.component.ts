import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EventsService } from '../../../events.service';
import { URLSearchParams } from '@angular/http';

import { CPSession } from '../../../../../../../session';

declare var $: any;

@Component({
  selector: 'cp-facebook-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class FacebookEventsDeleteComponent implements OnInit {
  @Input() link: any;
  @Output() deleted: EventEmitter<null> = new EventEmitter();

  constructor(
    private session: CPSession,
    private eventsService: EventsService
  ) { }

  onDelete() {
    const linkId = this.link.controls['id'].value;
    let search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    this
      .eventsService
      .deleteFacebookEventByLinkId(linkId, search)
      .subscribe(
        _ => {
          this.deleted.emit();
          $('#facebookDelete').modal('hide');
        }
      );
  }

  ngOnInit() { }
}
