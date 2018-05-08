import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// import { API } from '../../config/api';
import { BaseService } from '../../base/base.service';

@Injectable()
export class ControlPanelService extends BaseService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, ControlPanelService.prototype);
  }
}
