import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Injectable()
export class RouterUtils {
  constructor(private router: Router, private route: ActivatedRoute) {}

  appendParamToRoute(queryParams: Params) {
    this.router.navigate(['.'], {
      queryParams,
      relativeTo: this.route,
      queryParamsHandling: 'merge'
    });
  }

  getQueryParamByKeyName(key: string): number | string {
    return this.route.snapshot.queryParams[key] || null;
  }

  // toggleDirection(currentDirection: string): string {
  //   const asc = commonParams.direction.asc;
  //   const desc = commonParams.direction.desc;

  //   return currentDirection === asc ? desc : asc;
  // }
}
