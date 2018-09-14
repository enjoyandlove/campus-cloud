import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ProvidersService } from '../../../../../providers.service';
import { EventsService } from '../../../../../../events/events.service';

@Component({
  selector: 'cp-service-provider-edit-check-in',
  templateUrl: 'edit.component.html',
  providers: [ { provide: EventsService, useClass: ProvidersService}]
})
export class ServicesProvidersCheckInEditComponent {
  @Input() data;
  @Input() checkIn;

  @Output() teardown: EventEmitter<null> = new EventEmitter();
}
