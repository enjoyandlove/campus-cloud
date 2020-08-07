import { Component, EventEmitter, Input, Output } from '@angular/core';

import IServiceProvider from '@campus-cloud/containers/controlpanel/manage/services/providers.interface';
import { ProvidersService } from '@campus-cloud/containers/controlpanel/manage/services/providers.service';
import { EventsService } from '@campus-cloud/containers/controlpanel/manage/events/events.service';
import { ICheckIn } from '@campus-cloud/containers/controlpanel/manage/events/attendance/check-in/check-in.interface';

@Component({
  selector: 'cp-qr-create-check-in',
  templateUrl: './create.component.html',
  providers: [{ provide: EventsService, useClass: ProvidersService }]
})
export class QrCheckInCreateComponent {
  @Input() data: IServiceProvider;

  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() created: EventEmitter<ICheckIn> = new EventEmitter();
}
