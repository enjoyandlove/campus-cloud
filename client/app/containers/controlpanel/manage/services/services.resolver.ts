import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { ServicesService } from './services.service';

@Injectable()
export class ServicesResolver implements Resolve<any> {
  constructor(private service: ServicesService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.service.getServiceById(route.params['serviceId']);
  }
}
