import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

// import { API } from '../../config/api';
import { BaseService } from '../../base/base.service';

<<<<<<< HEAD
// const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.PRIVILEGE}/`;
=======
>>>>>>> 7887962c0cd34a0d05a11f9f29e4852aa1da79eb

@Injectable()
export class ControlPanelService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, ControlPanelService.prototype);
  }
<<<<<<< HEAD

  // getPrivileges() {
  //   return super.get(url).map(res => res.json() );
  // }
=======
>>>>>>> 7887962c0cd34a0d05a11f9f29e4852aa1da79eb
}

