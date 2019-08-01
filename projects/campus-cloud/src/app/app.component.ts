import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

import { pageTitle } from '@campus-cloud/shared/constants';
import { ZendeskService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-app',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private titleService: Title,
    private zendeskService: ZendeskService,
    private activatedRoute: ActivatedRoute
  ) {}

  setZendesk(routeObj) {
    if ('zendesk' in routeObj) {
      this.zendeskService.setHelpCenterSuggestions({
        labels: [routeObj['zendesk']]
      });
    }
  }

  setPageTitle() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((event) => {
        this.zendeskService.hide();
        this.setZendesk(event);
        const title = !event['title']
          ? `${pageTitle.CAMPUS_CLOUD}`
          : `${pageTitle.CAMPUS_CLOUD} ${event['title']}`;

        this.titleService.setTitle(title);
      });
  }

  ngOnInit() {
    this.setPageTitle();
  }
}
