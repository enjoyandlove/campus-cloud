import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { isProd } from '../../config/env';
import { CPTrackingService } from './../../shared/services/tracking.service';

@Component({
  selector: 'cp-controlpanel',
  styleUrls: ['./controlpanel.component.scss'],
  templateUrl: './controlpanel.component.html',
})
export class ControlPanelComponent implements OnInit {
  isProd = isProd;

  constructor(
    private router: Router,
    private cpTrackingService: CPTrackingService
  ) { }

  ngOnInit() {
    /**
     * this gets initilized only once
     * so we track the first page load here
     */
    this.cpTrackingService.gaTrackPage(this.router.url);
  }

}
