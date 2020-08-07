import { Component, EventEmitter, Input, Output } from '@angular/core';

import IServiceProvider from '@campus-cloud/containers/controlpanel/manage/services/providers.interface';
import { ProvidersService } from '@campus-cloud/containers/controlpanel/manage/services/providers.service';
import { EventsService } from '@campus-cloud/containers/controlpanel/manage/events/events.service';
import { ICheckIn } from '@campus-cloud/containers/controlpanel/manage/events/attendance/check-in/check-in.interface';

@Component({
  selector: 'cp-qr-edit-check-in',
  templateUrl: './edit.component.html',
  providers: [{ provide: EventsService, useClass: ProvidersService }]
})
export class QrCheckInEditComponent {
  @Input() checkIn: ICheckIn;
  @Input() data: IServiceProvider;

  @Output() edited: EventEmitter<null> = new EventEmitter();
  @Output() teardown: EventEmitter<null> = new EventEmitter();
}
