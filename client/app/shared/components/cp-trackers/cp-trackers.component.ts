import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { CPTrackingService } from './../../services/tracking.service';

@Component({
  selector: 'cp-trackers',
  templateUrl: './cp-trackers.component.html',
})
export class CPTrackersComponent implements OnInit {
  constructor(
    private router: Router,
    private cpTrackingService: CPTrackingService,
  ) {}

  listenForRouteChanges() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.cpTrackingService.hotJarRecordPage();
        this.cpTrackingService.gaTrackPage(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit() {
    this.listenForRouteChanges();
  }
}
