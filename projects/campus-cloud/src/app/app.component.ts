import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

import { pageTitle } from '@campus-cloud/shared/constants';
import {
  CPI18nService,
  ZendeskService,
  FullStoryService,
  CPTrackingService
} from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-app',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private titleService: Title,
    private zendeskService: ZendeskService,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: any,
    private cpTrackingService: CPTrackingService
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
        tap((event: NavigationEnd) => {
          this.cpTrackingService.gaTrackPage(event.urlAfterRedirects);
        }),
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
        (this.document.activeElement as any).blur();
        if (this.router.url.endsWith('#main')) {
          const main = this.document.getElementById('main');
          if (main) {
            main.focus();
          }
        }

        if (event.record) {
          FullStoryService.restart();
        } else {
          FullStoryService.shutdown();
        }
        this.zendeskService.hide();
        this.setZendesk(event);
        const title = !event['title']
          ? `${pageTitle.CAMPUS_CLOUD}`
          : `${pageTitle.CAMPUS_CLOUD} ${event['title']}`;

        this.titleService.setTitle(title);
      });
  }

  setDocumentLanguage() {
    this.document.documentElement.lang = CPI18nService.getLocale();
  }

  ngOnInit() {
    this.setPageTitle();
    this.setDocumentLanguage();
  }
}
