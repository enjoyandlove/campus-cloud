import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';

import { CPTrackingService } from './../../services/tracking.service';

@Component({
  selector: 'cp-trackers',
  templateUrl: './cp-trackers.component.html'
})
export class CPTrackersComponent implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public cpTrackingService: CPTrackingService
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
