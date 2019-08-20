import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiListComponent } from '@controlpanel/api-management/list';

@Injectable()
export class RouteNavigationGuard implements CanDeactivate<any> {
  canDeactivate(listComponent: ApiListComponent): Observable<boolean> | Promise<boolean> | boolean {
    return listComponent.canDeactivate ? listComponent.canDeactivate() : true;
  }
}
