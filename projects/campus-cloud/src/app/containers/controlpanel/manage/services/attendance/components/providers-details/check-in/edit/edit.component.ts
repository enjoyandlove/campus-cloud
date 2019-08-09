import { Component, EventEmitter, Input, Output } from '@angular/core';

import IServiceProvider from '../../../../../providers.interface';
import { ProvidersService } from '../../../../../providers.service';
import { EventsService } from '../../../../../../events/events.service';
import { ICheckIn } from '../../../../../../events/attendance/check-in/check-in.interface';

@Component({
  selector: 'cp-service-provider-edit-check-in',
  templateUrl: './edit.component.html',
  providers: [{ provide: EventsService, useClass: ProvidersService }]
})
export class ServicesProvidersCheckInEditComponent {
  @Input() checkIn: ICheckIn;
  @Input() data: IServiceProvider;

  @Output() edited: EventEmitter<null> = new EventEmitter();
  @Output() teardown: EventEmitter<null> = new EventEmitter();
}
