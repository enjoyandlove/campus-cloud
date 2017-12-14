/**
 * Common Table shared
 * between top-events and top services
 */
import { Component, OnInit, Input } from '@angular/core';

import { CPSession } from '../../../../../session';
import { DashboardUtilsService } from './../../dashboard.utils.service';

@Component({
  selector: 'cp-dashboard-top-resource',
  templateUrl: './dashboard-top-resource.component.html',
  styleUrls: ['./dashboard-top-resource.component.scss']
})
export class DashboardTopResourceComponent implements OnInit {
  isSuperAdmin;

  @Input() items;
  @Input() resource: string;

  defaultImage = require('public/default/user.png');

  constructor(
    private session: CPSession,
    private helper: DashboardUtilsService
  ) { }

  ngOnInit() {
    this.isSuperAdmin = this.helper.isSuperAdmin(this.session);
  }
}
