import { Component, OnInit, Input } from '@angular/core';

import { CPSession } from '../../../../../../session';
import { DashboardUtilsService } from '../../../dashboard.utils.service';
import { CP_PRIVILEGES_MAP } from '../../../../../../shared/constants';
import { canSchoolReadResource } from '../../../../../../shared/utils/privileges';

@Component({
  selector: 'cp-dashboard-top-resource-title',
  templateUrl: './dashboard-top-resource-title.component.html',
  styleUrls: ['./dashboard-top-resource-title.component.scss']
})
export class DashboardTopResourceComponent implements OnInit {
  @Input() isSuperAdmin;
  @Input() resource: string;

  canViewOrientation;
  defaultImage = require('public/default/user.png');

  constructor(
    public session: CPSession,
    public helper: DashboardUtilsService
  ) {}

  ngOnInit() {
    this.isSuperAdmin = this.helper.isSuperAdmin(this.session);

    this.canViewOrientation = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.orientation);
  }
}
