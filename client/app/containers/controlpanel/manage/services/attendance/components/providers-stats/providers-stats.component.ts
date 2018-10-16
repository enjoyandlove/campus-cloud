import { Component, Input } from '@angular/core';

import { IService } from '../../../service.interface';
import { ServiceAttendance } from '../../../services.status';

@Component({
  selector: 'cp-providers-stats',
  templateUrl: './providers-stats.component.html',
  styleUrls: ['./providers-stats.component.scss']
})
export class ServicesProviderStatsComponent {
  @Input() service: IService;

  attendanceEnabled = ServiceAttendance.enabled;

  constructor() {}
}
