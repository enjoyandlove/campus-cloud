import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CPI18nService } from '../../../../../../../../shared/services';

@Component({
  selector: 'cp-calendars-delete',
  templateUrl: './calendars-delete.component.html',
  styleUrls: ['./calendars-delete.component.scss']
})
export class DeleteCheckInComponent implements OnInit {
  @Input() checkIn;
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  buttonData;
  eventProperties;

  constructor(public cpI18n: CPI18nService) {}

  onDelete() {
    this.deleted.emit(this.checkIn.id);

    $('#calendarDelete').modal('hide');

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
