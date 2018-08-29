import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { ICheckIn } from '../check-in.interface';
import { EventsService } from '../../../events.service';
import { CPSession } from '../../../../../../../session';
import { CPI18nService } from '../../../../../../../shared/services';

@Component({
  selector: 'cp-delete-check-in',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class CheckInDeleteComponent implements OnInit {
  @Input() event;
  @Input() checkIn: ICheckIn;
  @Input() orientationId: number;

  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  buttonData;
  errorMessage;
  errors = false;
  eventProperties;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: EventsService
  ) {}

  onDelete() {
    this.errors = false;
    let search = new HttpParams()
      .append('event_id', this.event.id.toString());

    if (this.orientationId) {
      search = search
        .append('school_id', this.session.g.get('school').id)
        .append('calendar_id', this.orientationId.toString());
    }

    this.service.deleteEventCheckInById(this.checkIn.id, search).subscribe(
      (_) => {
        this.deleted.emit(this.checkIn.id);
        this.teardown.emit();
        $('#deleteCheckInModal').modal('hide');
      },
      (_) => {
        this.errors = true;
        this.enableDeleteButton();
        this.errorMessage = this.cpI18n.translate('something_went_wrong');
      });
  }

  enableDeleteButton() {
    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };
  }
}
