import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HTTPService } from '../../base/http.service';

@Injectable()
export class ControlPanelService extends HTTPService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, ControlPanelService.prototype);
  }
}
