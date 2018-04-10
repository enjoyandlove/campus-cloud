import { Component } from '@angular/core';

import { CheckinService } from '../checkin.service';
import { OrientationCheckinService } from '../orientation.checkin.service';

@Component({
  selector: 'cp-orientation-checkin-events',
  template: `<cp-checkin-events></cp-checkin-events>`,
  providers: [{provide: CheckinService, useClass: OrientationCheckinService}]
})

export class CheckinOrientationEventsComponent {
  constructor() {}

}
