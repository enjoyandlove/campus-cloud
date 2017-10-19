import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { EventsService } from '../events.service';

declare var $: any;

@Component({
  selector: 'cp-events-delete',
  templateUrl: './events-delete.component.html',
  styleUrls: ['./events-delete.component.scss']
})
export class EventsDeleteComponent implements OnInit {
  @Input() event: any;
  @Output() deletedEvent: EventEmitter<number> = new EventEmitter();

  buttonData;

  constructor(
    private eventService: EventsService,
  ) { }

  onDelete() {
    this
      .eventService
      .deleteEventById(this.event.id)
      .subscribe(
        _ => {
          this.deletedEvent.emit(this.event.id);
          $('#deleteEventsModal').modal('hide');
          this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
        });
  }

  ngOnInit() {
    this.buttonData = {
      text: 'Delete',
      class: 'danger'
    }
  }
}
