import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ProvidersService } from '../../../../../providers.service';
import { EventsService } from '../../../../../../events/events.service';
import { ICheckIn } from '../../../../../../events/attendance/check-in/check-in.interface';

@Component({
  selector: 'cp-service-provider-create-check-in',
  templateUrl: 'create.component.html',
  providers: [ { provide: EventsService, useClass: ProvidersService}]
})
export class ServicesProvidersCheckInCreateComponent {
  @Input() data;

  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() created: EventEmitter<ICheckIn> = new EventEmitter();
}
