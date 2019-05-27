import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

import { pageTitle } from '@shared/constants';

@Component({
  selector: 'cp-app',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute
  ) {}

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
