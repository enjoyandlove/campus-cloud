import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EventsService } from '../../../events.service';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '../../../../../../../session';
import { CPI18nService } from '../../../../../../../shared/services/index';

declare var $: any;

@Component({
  selector: 'cp-facebook-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class FacebookEventsDeleteComponent implements OnInit {
  @Input() link: any;
  @Output() deleted: EventEmitter<null> = new EventEmitter();

  buttonData;

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private eventsService: EventsService
  ) {}

  onDelete() {
    const linkId = this.link.controls['id'].value;

    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.eventsService.deleteFacebookEventByLinkId(linkId, search).subscribe((_) => {
      this.deleted.emit();
      this.buttonData = Object.assign({}, this.buttonData, {
        disabled: false
      });
      $('#facebookDelete').modal('hide');
    });
  }

  ngOnInit() {
    this.buttonData = {
      class: 'danger',
      text: this.cpI18n.translate('delete')
    };
  }
}
