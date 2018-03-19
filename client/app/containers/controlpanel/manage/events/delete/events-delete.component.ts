import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { EventsService } from '../events.service';
import { CPI18nService } from '../../../../../shared/services';
import { OrientationService } from '../../orientation/orientation.services';

declare var $: any;

@Component({
  selector: 'cp-events-delete',
  templateUrl: './events-delete.component.html',
  styleUrls: ['./events-delete.component.scss'],
})
export class EventsDeleteComponent implements OnInit {
  @Input() event: any;
  @Input() isOrientation: boolean;
  @Output() deletedEvent: EventEmitter<number> = new EventEmitter();

  service;
  buttonData;

  constructor(
    private cpI18n: CPI18nService,
    private eventService: EventsService,
    private orientationService: OrientationService,
  ) {}

  onDelete() {
    this.service = this.isOrientation ? this.orientationService : this.eventService;
    this.service.deleteEventById(this.event.id).subscribe(() => {
      this.deletedEvent.emit(this.event.id);

      $('#deleteEventsModal').modal('hide');

      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
    });
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger',
    };
  }
}
