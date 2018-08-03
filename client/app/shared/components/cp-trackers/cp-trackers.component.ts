import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CPTrackingService } from './../../services/tracking.service';

declare var Beamer;

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
    Beamer.init();

    this.listenForRouteChanges();
  }
}
