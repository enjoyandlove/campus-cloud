/**
 * Common Table shared
 * between top-events and top services
 */
import { Component, OnInit, Input } from '@angular/core';

import { CPSession } from '../../../../../session';
import { CP_PRIVILEGES_MAP } from '../../../../../shared/constants';
import { DashboardUtilsService } from '../../dashboard.utils.service';
import { canSchoolReadResource } from '../../../../../shared/utils/privileges';

@Component({
  selector: 'cp-dashboard-top-resource',
  templateUrl: './dashboard-top-resource.component.html',
  styleUrls: ['./dashboard-top-resource.component.scss']
})
export class DashboardTopResourceComponent implements OnInit {
  @Input() items;
  @Input() resource: string;

  isSuperAdmin;
  isOrientation;
  canViewOrientation;
  hasPrivilege = false;
  defaultImage = require('public/default/user.png');

  constructor(
    public session: CPSession,
    public helper: DashboardUtilsService
  ) {}

  getResourceURL(item) {
    if (this.isOrientation) {
      return `/manage/${this.resource}/${item.calendar_id}/events/${item.id}`;
    }

    return `/manage/${this.resource}/${item.id}`;
  }

  ngOnInit() {
    this.isOrientation = this.resource === 'orientation';
    this.isSuperAdmin = this.helper.isSuperAdmin(this.session);
    this.canViewOrientation = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.orientation);

    if ((this.isSuperAdmin && !this.isOrientation)
      || (this.isOrientation && this.canViewOrientation)) {

      this.hasPrivilege = true;
    } else if ((!this.isSuperAdmin && !this.isOrientation)
      || (this.isOrientation && !this.canViewOrientation)) {

      this.hasPrivilege = false;
    }
  }
}
