import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ProvidersService } from '../../../../../providers.service';
import { EventsService } from '../../../../../../events/events.service';
import { ICheckIn } from '../../../../../../events/attendance/check-in/check-in.interface';

@Component({
  selector: 'cp-service-provider-delete-check-in',
  templateUrl: 'delete.component.html',
  providers: [ { provide: EventsService, useClass: ProvidersService}]
})
export class ServicesProvidersCheckInDeleteComponent {
  @Input() data;
  @Input() checkIn: ICheckIn;

  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();
}
