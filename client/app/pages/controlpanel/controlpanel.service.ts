import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

// import { API } from '../../config/api';
import { BaseService } from '../../base/base.service';

// const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.PRIVILEGE}/`;

@Injectable()
export class ControlPanelService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, ControlPanelService.prototype);
  }

  // getPrivileges() {
  //   return super.get(url).map(res => res.json() );
  // }
}

