import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CPSession } from './../../../session';
import { CPTrackingService } from './../../services/tracking.service';

declare var window;

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

  beamerInit() {
    const user = this.session.g.get('user');
    const { firstname, lastname, id, email } = user;
    const beamer_config = {
      user_id: id,
      user_email: email,
      user_firstname: firstname,
      user_lastname: lastname,
      selector: 'beamerButton',
      product_id: 'fUBlZgzD4800'
    };

    window.beamer_config = beamer_config;

    const script = document.createElement('script');
    script.src = 'https://app.getbeamer.com/js/beamer-embed.js';

    document.body.appendChild(script);
  }

  ngOnInit() {
    this.beamerInit();

    this.listenForRouteChanges();
  }
}
