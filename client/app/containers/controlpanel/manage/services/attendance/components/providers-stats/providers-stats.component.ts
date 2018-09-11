import { Component, Input } from '@angular/core';

import { ServiceFeedback } from '../../../services.status';

@Component({
  selector: 'cp-providers-stats',
  templateUrl: './providers-stats.component.html',
  styleUrls: ['./providers-stats.component.scss']
})
export class ServicesProviderStatsComponent {

  @Input() service;

  feedbackEnabled = ServiceFeedback.enabled;

  constructor() {}
}
