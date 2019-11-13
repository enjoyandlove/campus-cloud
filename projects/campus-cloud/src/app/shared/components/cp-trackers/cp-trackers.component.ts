import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { CPTrackingService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-trackers',
  templateUrl: './cp-trackers.component.html'
})
export class CPTrackersComponent implements OnInit {
  constructor(
    public router: Router,
    public session: CPSession,
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
