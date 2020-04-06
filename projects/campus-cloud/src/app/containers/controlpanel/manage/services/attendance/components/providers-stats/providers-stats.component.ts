import { Component, Input, OnInit } from '@angular/core';

import { IService } from '../../../service.interface';
import { STAR_SIZE } from '@campus-cloud/shared/components';
import { ServiceAttendance } from '../../../services.status';

@Component({
  selector: 'cp-providers-stats',
  templateUrl: './providers-stats.component.html',
  styleUrls: ['./providers-stats.component.scss']
})
export class ServicesProviderStatsComponent implements OnInit {
  @Input() service: IService;

  MAX_RATE = 5;
  serviceRating;
  detailStarSize = STAR_SIZE.DEFAULT;
  attendanceEnabled = ServiceAttendance.enabled;

  constructor() {}

  ngOnInit() {
    this.serviceRating = ((this.service.avg_rating_percent * this.MAX_RATE) / 100).toFixed(1);
  }
}
