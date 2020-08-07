import { Component, EventEmitter, Input, Output } from '@angular/core';

import IServiceProvider from '@campus-cloud/containers/controlpanel/manage/services/providers.interface';
import { ProvidersService } from '@campus-cloud/containers/controlpanel/manage/services/providers.service';
import { EventsService } from '@campus-cloud/containers/controlpanel/manage/events/events.service';
import { ICheckIn } from '@campus-cloud/containers/controlpanel/manage/events/attendance/check-in/check-in.interface';

@Component({
  selector: 'cp-qr-delete-check-in',
  templateUrl: './delete.component.html',
  providers: [{ provide: EventsService, useClass: ProvidersService }]
})
export class QrCheckInDeleteComponent {
  @Input() checkIn: ICheckIn;
  @Input() data: IServiceProvider;

  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();
}
